using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using QuizApp.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace QuizApp.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
       public DbSet<User> Users { get; set; } 
       public DbSet<Quiz> Quizzes { get; set; }
       public DbSet<Question> Questions{ get; set; }
       public DbSet<Answer> Answers { get; set; }

       public DbSet<QuizAttempt> QuizAttempts { get; set; }
       public DbSet<UserAnswer> UserAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Quiz>() // Start configuring Quiz table
                .HasOne(q => q.User) // connects to the User Table trhough a one to one connection
                .WithMany(u => u.Quizzes) // connects User to Quizzes through a one to many connection
                .HasForeignKey(q => q.UserId) // We specify what the foreign key is
                .OnDelete(DeleteBehavior.Cascade); //Delete cascade makes usre that if an entity is delete, so are it's child entities

            modelBuilder.Entity<Question>() // we repeat previous model on each of the tables, determining relations
                .HasOne(q => q.Quiz)
                .WithMany(qz => qz.Questions)
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuizAttempt>() // QuizAttempt table joins two tables, User and Quiz, so we have two models for it. 
                .HasOne(qa => qa.User)
                .WithMany(u => u.QuizAttempts)
                .HasForeignKey(qa => qa.UserId)
                .OnDelete(DeleteBehavior.Restrict); // set to restrict, had it as cascade, but this caused the database to go in circles during testing

            modelBuilder.Entity<QuizAttempt>()
                .HasOne(qa => qa.Quiz)
                .WithMany(qz => qz.QuizAttempts)
                .HasForeignKey(qa => qa.QuizId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<UserAnswer>() // UserAnswer similarly is a join table, it joins three tables however, which is why we have three models. 
                .HasOne(ua => ua.QuizAttempt)
                .WithMany(qa => qa.UserAnswers)
                .HasForeignKey(ua => ua.QuizAttemptId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.Question)
                .WithMany()
                .HasForeignKey(ua => ua.QuestionId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict makes it so the Question is not deleted if the UserAnswer is deleted

            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.Answer)
                .WithMany()
                .HasForeignKey(ua => ua.AnswerId)
                .OnDelete(DeleteBehavior.Restrict); // makes sure an Answer is not deleted if a Useranswer is.
        }
    }
}

