using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace QuizApp.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        public virtual ICollection<Quiz> Quizzes { get; set; }
        public virtual ICollection<QuizAttempt> QuizAttempts { get; set; }
    }
}
