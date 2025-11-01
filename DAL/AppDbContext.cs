using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using QuizApp.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace QuizApp.DAL
{
    public class AppDbContext : DbContext
    {
       public DbSet<User> Users { get; set; } 
       public DbSet<Quiz> Quizzes { get; set; }
       public DbSet<Question> Questions{ get; set; }
       public DbSet<Answer> Answers { get; set; }

       public DbSet<QuizAttempt> QuizAttempts { get; set; }
       public DbSet<UserAnswer> UserAnswers { get; set; }
    }
}

