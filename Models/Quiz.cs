using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Quiz
    {
        public int QuizId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // links to User
        public int UserId { get; set; } 
        public User User { get; set; } = null!;

        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}
