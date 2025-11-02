using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;

namespace QuizApp.Models
{
    public class Question
    {
        public int QuestionId { get; set; } //Primary Key

        [Required]
        public string QuestionText { get; set; } = string.Empty;
        public int QuizId { get; set; } // Foreign Key linking to Quiz
        public Quiz Quiz { get; set; } = null!;
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}