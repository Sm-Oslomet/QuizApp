using System;
using System.Collections.Generic;

namespace QuizApp.Models
{
    public class QuizAttempt
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        public int Score { get; set; }
        public int TotalQuestions { get; set; }

        public DateTime AttemptedAt { get; set; }

        public virtual ICollection<UserAnswer> UserAnswers { get; set; }

    }
}
