using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using QuizApp.Controllers;

namespace QuizApp.Models;

public class User
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
