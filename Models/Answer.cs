using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Answer 
    {
        public int AnswerId { get; set; }

        [Required]
        public string AnswerText { get; set; } = string.Empty; // set Answertext as required
        public bool IsCorrect { get; set; } // allows us to pick wether the option is the correct one or not
        public int QuestionId { get; set; } // FK for Question table, so we can connect Options to a Question 
        public Question Question { get; set; } = null!;
    }
}
