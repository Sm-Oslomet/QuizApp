using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Answer
    {
        public int AnswerId { get; set; }

        [Required]
        public string AnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;
    }
}
