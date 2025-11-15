using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using QuizApp.Controllers;

namespace QuizApp.Models
{

    public class User
    {
        public int UserId { get; set; }
        [Required]
        [MaxLength(225)]
        public string Email {get;set;} = string.Empty;

        [MaxLength(20)]
        public string Username { get; set; } = string.Empty;


        public string PasswordHash { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
        public bool IsVerified { get; set; } // check if a user has their email verified
        public string? ResetToken { get; set; } // password reset token
        public DateTime? ResetTokenExpiry { get; set; } // expiration time for the token
        public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();

        // Since QuizAttempt links to UserAnswer, we can have User linked to QuizAttempt
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}