using QuizApp.DAL.Interfaces;
using QuizApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace QuizApp.DAL.Repositories
{
    public class QuizAttemptRepository : IQuizAttemptRepository
    {
        private readonly AppDbContext _context;
        public QuizAttemptRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<QuizAttempt>> GetAttemptsByUserAsync(int userId)
        {
            return await _context.QuizAttempts
            .Where(a => a.UserId == userId)
            .Include(a => a.Quiz)
            .ToListAsync();
        }
        public async Task<QuizAttempt?> GetAttemptByIdAsync(int attemptId) // we want to have a model of the attempt, 
        // the answers from a user, the question this answer was givento .
        //  We have them all in one model this way since useranswer links to the question and the answer 
        {
            return await _context.QuizAttempts
            .Include(a => a.UserAnswers) // gives use a list of a User's answers
            .ThenInclude(ua => ua.Question) // adds to the previous one, by linking the Question related to the each of the 
                                            // answers. It is possible to return all the answers here that way the correct 
                                            // answer is also visible. By writing .ThenInclude(q=>q.Answers) 
            .Include(a => a.UserAnswers) // We use this to get to the Answer given by the user
            .ThenInclude(ua => ua.Answer) // links to the answer given by the user
            .FirstOrDefaultAsync(a => a.QuizAttemptId == attemptId); // We run this to return the first QuizAttempt Id that matches the attemptID
        } 
        public async Task AddAttemptAsync(QuizAttempt attempt)
        {
            await _context.QuizAttempts.AddAsync(attempt);
        }
        public async Task UpdateAttemptAsync(QuizAttempt attempt)
        {
            _context.QuizAttempts.Update(attempt);
            await SaveChangesAsync();
        }
        public async Task<bool> DeleteAttemptAsync(int attemptId)
        {
            var attempt = await GetAttemptByIdAsync(attemptId); // we check to see if an attempt exists, if it doesn't, we do not
            //  want to write extra code in the controller or run into an exception. The remove is only done if an attempt exists
            if (attempt == null)
            {
                return false;
            }
            _context.QuizAttempts.Remove(attempt);
            await SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<UserAnswer>> GetUserAnswersByAttemptIdAsync(int attemptId)
        { // similarly to earlier method, we want to build a model of a User's attempt, including the question and their answer
            return await _context.UserAnswers
            .Where(ua => ua.QuizAttemptId == attemptId)
            .Include(ua => ua.Question)
            .Include(ua => ua.Answer)
            .ToListAsync();
        } 
        public async Task AddUserAnswerAsync(UserAnswer userAnswer)
        {
            await _context.UserAnswers.AddAsync(userAnswer);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}