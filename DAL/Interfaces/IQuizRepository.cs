using QuizApp.Models;

namespace QuizApp.DAL.Interfaces
// we create an interface to handle crud for Quiz , Question and answer.  
{
    public interface IQuizRepository
    {
        // opreations for a Quiz
        Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(int userId);
        Task<Quiz?> GetQuizByIdAsync(int id);
        Task CreateQuizAsync(Quiz quiz); // we give each of the 3 operations their own unique names instead of all having "create" since that could lead to confusion when all 3 are called.
        Task UpdateQuizAsync(Quiz quiz);
        Task <bool>DeleteQuizAsync(int quizId);

        // operations for a Question
        Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(int quizId);
        Task<Question?> GetQuestionByIdAsync(int id);
        Task CreateQuestionAsync(Question question);
        Task UpdateQuestionAsync(Question question);
        Task <bool>DeleteQuestionAsync(int id);

        // operations for an Answer

        Task<IEnumerable<Answer>> GetAnswersByQuestionIdAsync(int questionId);
        Task<Answer?> GetAnswerByIdAsync(int id);
        Task CreateAnswerAsync(Answer answer);
        Task UpdateAnswerAsync(Answer answer);
        Task <bool>DeleteAnswerAsync(int id);

        Task SaveChangesAsync();
    }
}