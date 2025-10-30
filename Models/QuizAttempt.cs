using System;
using System.Collections.Generic;


// join table for User and Quiz
namespace QuizApp.Models
{
    public class QuizAttempt
    {
        public int QuizAttemptId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; } = null!;

        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public DateTime AttemptedAt { get; set; } = DateTime.Now;

        public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
    }
}
