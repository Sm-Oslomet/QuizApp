using QuizApp.DAL.Interfaces;
using QuizApp.Models;
using Microsoft.EntityFrameworkCore;

namespace QuizApp.DAL.Repositories
{
    public class QuizRepository : IQuizRepository
    {
        private readonly AppDbContext _context;

        public QuizRepository(AppDbContext context)
        {
            _context = context;
        }

        // CRUD for Quiz
        public async Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(int userId)
        {
            return await _context.Quizzes
            .Where(q=>q.UserId == userId)
            .Include(q => q.Questions)
            .ThenInclude(a => a.Answers)
            .ToListAsync();
        }
        public async Task<Quiz?> GetQuizByIdAsync(int id)
        {
            return await _context.Quizzes
            .Include(q => q.Questions)
                .ThenInclude(a => a.Answers)
            .Include(q=> q.QuizAttempts)
            .FirstOrDefaultAsync(q => q.QuizId == id);
        }
        public async Task CreateQuizAsync(Quiz quiz)
        {
            await _context.Quizzes.AddAsync(quiz);
        }
        public async Task UpdateQuizAsync(Quiz quiz)
        {

            var existingQuestions = await _context.Questions
                .Where(q => q.QuizId == quiz.QuizId)
                .Include(q => q.Answers)
                .ToListAsync();

            var answerIdsToRemove = existingQuestions
                .SelectMany(q => q.Answers)
                .Select(a => a.AnswerId)
                .ToList();


            if (answerIdsToRemove.Any())
            {
                var userAnswersToRemove = await _context.UserAnswers
                    .Where(ua => answerIdsToRemove.Contains(ua.AnswerId))
                    .ToListAsync();


                if (userAnswersToRemove.Any())
                {
                    _context.UserAnswers.RemoveRange(userAnswersToRemove);
                }
            }

            foreach (var q in existingQuestions)
            {
                _context.Answers.RemoveRange(q.Answers);
            }

            _context.Questions.RemoveRange(existingQuestions);

            await _context.SaveChangesAsync();

            var tracked = _context.ChangeTracker.Entries<Quiz>()
                .FirstOrDefault(e => e.Entity.QuizId == quiz.QuizId);
            if (tracked != null)
                tracked.State = EntityState.Detached;


            _context.Quizzes.Update(quiz);
            await SaveChangesAsync();
        }
        public async Task<bool> DeleteQuizAsync(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .Include(q => q.QuizAttempts)
                    .ThenInclude(a => a.UserAnswers)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (quiz == null)
                return false;


            var userAnswers = quiz.QuizAttempts
                .SelectMany(a => a.UserAnswers)
                .ToList();

            if (userAnswers.Any())
                _context.UserAnswers.RemoveRange(userAnswers);


            if (quiz.QuizAttempts.Any())
                _context.QuizAttempts.RemoveRange(quiz.QuizAttempts);

            foreach (var question in quiz.Questions)
            {
                if (question.Answers.Any())
                    _context.Answers.RemoveRange(question.Answers);
            }

            if (quiz.Questions.Any())
                _context.Questions.RemoveRange(quiz.Questions);

            _context.Quizzes.Remove(quiz);

            await _context.SaveChangesAsync();
            return true;
        }

        // Questions CRUDs

        public async Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(int quizId)
        {
            return await _context.Questions // we create an object that gives us a list of Questions based on the quizid, and their related answers
            .Where(q => q.QuizId == quizId)
            .Include(q => q.Answers)
            .ToListAsync();
        }
        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            return await _context.Questions // similar to the previous one, but instead of using a quiz id to return all questions,
            //  we get one question that matches the id given and it's related answers
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.QuestionId == id);
        }
        public async Task CreateQuestionAsync(Question question)
        {
            await _context.Questions.AddAsync(question);
        }
        public async Task UpdateQuestionAsync(Question question)
        {
            _context.Questions.Update(question);
            await SaveChangesAsync();
        }
        public async Task<bool>DeleteQuestionAsync(int id)
        {
            var question = await GetQuestionByIdAsync(id);
            if (question == null)
            {
                return false;
            }
            _context.Questions.Remove(question);
            await SaveChangesAsync();
            return true;
        }


        // CRUD for Answers

        public async Task<IEnumerable<Answer>> GetAnswersByQuestionIdAsync(int quesitonId)
        {
            return await _context.Answers
                .Where(a => a.QuestionId == quesitonId)
                .ToListAsync();
        }
        public async Task<Answer?> GetAnswerByIdAsync(int id)
        {
            return await _context.Answers.FirstOrDefaultAsync(a => a.AnswerId == id);
        }

        public async Task CreateAnswerAsync(Answer answer)
        {
            await _context.Answers.AddAsync(answer);
        }
        public async Task UpdateAnswerAsync(Answer answer)
        {
            _context.Answers.Update(answer);
            await SaveChangesAsync();
        }
        public async Task<bool> DeleteAnswerAsync(int id)
        {
            var answer = await GetAnswerByIdAsync(id);
            if (answer == null)
            {
                return false;
            }
            _context.Answers.Remove(answer);
            await SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}

