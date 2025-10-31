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
    }
}

