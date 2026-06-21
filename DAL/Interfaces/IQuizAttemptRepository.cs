using QuizApp.Models;

namespace QuizApp.DAL.Interfaces
{
    public interface IQuizAttemptRepository
    {
        Task<IEnumerable<QuizAttempt>> GetAttemptsByUserAsync(int userId);
        Task<QuizAttempt?> GetAttemptByIdAsync(int attemptId);
        Task AddAttemptAsync(QuizAttempt quizattempt); // we could've just called it "create" but this could add confusion. Therefore
                                                     // CRUD methods get named Add, Update, Delete and get additional info so we know 
                                                     // what we are referencing
        Task UpdateAttemptAsync(QuizAttempt quizattempt);
        Task<bool> DeleteAttemptAsync(int id);

        Task<IEnumerable<UserAnswer>> GetUserAnswersByAttemptIdAsync(int attemptId);
        Task AddUserAnswerAsync(UserAnswer useranswer);

        Task SaveChangesAsync();
    }
}