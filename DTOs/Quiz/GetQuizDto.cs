using QuizApp.Models;
namespace QuizApp.DTOs.Quiz
{
        public class QuizDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int UserId { get; set; }
        public User User{ get; set; }

        public string CreatorName {get;set;} = string.Empty;
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuestionDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public int AnswerId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}