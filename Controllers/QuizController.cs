using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL.Interfaces;
using QuizApp.DTOs.Quiz;
using QuizApp.Models;
using System.Security.Claims;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]// authentication required to access all the endpoints in this controller
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepo; // CRUD for Quiz
        private readonly IQuizAttemptRepository _quizAttemptRepo; // Since we separated QuizAttempt and Quiz Repo/Interfaces into their own files, we need to access both

        public QuizController(IQuizRepository quizRepo, IQuizAttemptRepository quizAttemptRepo) // dependency injection, allows controller to call into the data layer
        {
            _quizRepo = quizRepo;
            _quizAttemptRepo = quizAttemptRepo;
        }

        private int GetCurrentUserId() // We extract UserId from the jwt token that was created in account creation
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetMyQuizzes() // gets all quizzes
        {
            var userId = GetCurrentUserId();
            var quizzes = await _quizRepo.GetAllQuizzesByUserIdAsync(userId); // pulls quizzess by the current user, based on userId

            var quizDtos = quizzes.Select(q => new QuizDto // We convert each quiz to QuizDtom 
            {
                QuizId = q.QuizId, // for each quiz we also map their questions and answers, to QuestionDto and AnswerDto
                Title = q.Title,
                Description = q.Description,
                CreatedAt = q.CreatedAt,
                UserId = q.UserId,
                Questions = q.Questions.Select(ques => new QuestionDto
                {
                    QuestionId = ques.QuestionId,
                    QuestionText = ques.QuestionText,
                    Answers = ques.Answers.Select(a => new AnswerDto
                    {
                        AnswerId = a.AnswerId,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList() // this way we only return data, keeping EF navigation properties separate
            });

            return Ok(quizDtos); // returns json of a user's quizzes
        }

        [HttpGet("{id}")] // a GET methot based on a Quiz id
        public async Task<IActionResult> GetQuiz(int id)
        {
            var quiz = await _quizRepo.GetQuizByIdAsync(id); // test to see if the quiz exists, based on it's quizId
            if (quiz == null) return NotFound(new { message = "Quiz not found" });

            var quizDto = new QuizDto // we map the quiz nito a QuizDto, same structure as earlier
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedAt = quiz.CreatedAt,
                UserId = quiz.UserId,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new AnswerDto
                    {
                        AnswerId = a.AnswerId,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto) // model to create a new quiz
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data" });

            var userId = GetCurrentUserId(); // quiz is set to the current user

            var quiz = new Quiz // we build a quiz with nested questions and answers
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId,
                CreatedAt = DateTime.Now,
                Questions = dto.Questions.Select(q => new Question // nesting question
                {
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new Answer // nesting answer
                    {
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            await _quizRepo.CreateQuizAsync(quiz);

            // Return DTO instead of EF entity
            var quizDto = new QuizDto // we then map the quiz to a quizdto 
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedAt = quiz.CreatedAt,
                UserId = quiz.UserId,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new AnswerDto
                    {
                        AnswerId = a.AnswerId,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.QuizId }, quizDto);
        }

        [HttpPut("{id}")] // method for updating quiz
        public async Task<IActionResult> UpdateQuiz(int id, [FromBody] CreateQuizDto dto)
        {
            var userId = GetCurrentUserId();
            var quiz = await _quizRepo.GetQuizByIdAsync(id);

            if (quiz == null || quiz.UserId != userId) // make sure quiz exists and belongs to current user
                return NotFound(new { message = "Quiz not found" });

            quiz.Title = dto.Title; // updatesfields
            quiz.Description = dto.Description;

            quiz.Questions.Clear(); // replaces questions and answers
            quiz.Questions = dto.Questions.Select(q => new Question
            {
                QuestionText = q.QuestionText,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            await _quizRepo.UpdateQuizAsync(quiz);

            return Ok();
        }

        [HttpDelete("{id}")] // method for deleting a quiz based on it's id
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var userId = GetCurrentUserId();
            var quiz = await _quizRepo.GetQuizByIdAsync(id);

            if (quiz == null || quiz.UserId != userId) // same check to see the quiz exists and belongs to the user
                return NotFound(new { message = "Quiz not found" });

            await _quizRepo.DeleteQuizAsync(quiz.QuizId); // asynchroniously deletes quiz
            return Ok(new { message = "Quiz deleted successfully" });
        }

        [HttpPost("submit")]// method that handles quiz completion by a user
        public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizDto dto)
        {
            var userId = GetCurrentUserId();
            var quiz = await _quizRepo.GetQuizByIdAsync(dto.QuizId);

            if (quiz == null)
                return NotFound(new { message = "Quiz not found" });


            int score = 0; // score calculation
            var userAnswers = new List<UserAnswer>();

            foreach (var userAnswer in dto.UserAnswers) // we iterate over the submition
            {
                var question = quiz.Questions.FirstOrDefault(q => q.QuestionId == userAnswer.QuestionId);
                var answer = question?.Answers.FirstOrDefault(a => a.AnswerId == userAnswer.AnswerId);

                if (answer != null)
                {
                    userAnswers.Add(new UserAnswer // for each useranswer we get the question and the answer
                    {
                        QuestionId = userAnswer.QuestionId, 
                        AnswerId = userAnswer.AnswerId
                    });

                    if (answer.IsCorrect)
                        score++; // increases score each time the user is correct
                }
            }

            var attempt = new QuizAttempt // we create attempt records and store all the info
            {
                UserId = userId,
                QuizId = dto.QuizId,
                Score = score,
                TotalQuestions = quiz.Questions.Count,
                AttemptedAt = DateTime.Now,
                UserAnswers = userAnswers
            };

            await _quizAttemptRepo.AddAttemptAsync(attempt); // we use quizattempt repo to save attempts

            return Ok(new // returns info on the attempt, with score and percentage correct
            {
                attemptId = attempt.QuizAttemptId,
                score = attempt.Score,
                totalQuestions = attempt.TotalQuestions,
                percentage = attempt.Score * 100.0 / attempt.TotalQuestions
            });
        }
    }
}
