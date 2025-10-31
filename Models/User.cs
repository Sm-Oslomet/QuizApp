using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using QuizApp.Controllers;

namespace QuizApp.Models;

public class User
{
    public int UserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Username { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();

    // Since QuizAttempt links to UserAnswer, we can have User linked to QuizAttempt
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>(); 
}
