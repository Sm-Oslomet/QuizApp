using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.DAL;
using QuizApp.DTOs.Quiz;
using QuizApp.Models;
using System;
using System.Security.Claims;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuizController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetMyQuizzes()
        {
            var userId = GetCurrentUserId();
            var quizzes = await _context.Quizzes
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new
                {
                    q.Id,
                    q.Title,
                    q.Description,
                    q.CreatedAt,
                    q.UserId,
                    QuestionCount = q.Questions.Count()
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            return Ok(quiz);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data" });
            }

            var userId = GetCurrentUserId();

            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId,
                CreatedAt = DateTime.Now,
                Questions = dto.Questions.Select(q => new Question
                {
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new Answer
                    {
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuiz(int id, [FromBody] CreateQuizDto dto)
        {
            var userId = GetCurrentUserId();
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quiz == null)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            // Update quiz details
            quiz.Title = dto.Title;
            quiz.Description = dto.Description;

            // Remove old questions and answers
            _context.Questions.RemoveRange(quiz.Questions);

            // Add new questions and answers
            quiz.Questions = dto.Questions.Select(q => new Question
            {
                QuestionText = q.QuestionText,
                QuizId = quiz.Id,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            await _context.SaveChangesAsync();

            return Ok(quiz);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var userId = GetCurrentUserId();
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quiz == null)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Quiz deleted successfully" });
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizDto dto)
        {
            var userId = GetCurrentUserId();
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            // Calculate score
            int score = 0;
            var userAnswers = new List<UserAnswer>();

            foreach (var userAnswer in dto.UserAnswers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == userAnswer.QuestionId);
                var answer = question?.Answers.FirstOrDefault(a => a.Id == userAnswer.AnswerId);

                if (answer != null)
                {
                    userAnswers.Add(new UserAnswer
                    {
                        QuestionId = userAnswer.QuestionId,
                        AnswerId = userAnswer.AnswerId
                    });

                    if (answer.IsCorrect)
                    {
                        score++;
                    }
                }
            }

            // Save quiz attempt
            var attempt = new QuizAttempt
            {
                UserId = userId,
                QuizId = dto.QuizId,
                Score = score,
                TotalQuestions = quiz.Questions.Count,
                AttemptedAt = DateTime.Now,
                UserAnswers = userAnswers
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                attemptId = attempt.Id,
                score = attempt.Score,
                totalQuestions = attempt.TotalQuestions,
                percentage = (attempt.Score * 100.0) / attempt.TotalQuestions
            });
        }

        [HttpGet("attempt/{attemptId}")]
        public async Task<IActionResult> GetAttempt(int attemptId)
        {
            var userId = GetCurrentUserId();
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                    .ThenInclude(q => q.Questions)
                        .ThenInclude(q => q.Answers)
                .Include(a => a.UserAnswers)
                .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

            if (attempt == null)
            {
                return NotFound(new { message = "Attempt not found" });
            }

            return Ok(attempt);
        }
    }
}