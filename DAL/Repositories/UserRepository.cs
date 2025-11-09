using QuizApp.Models;
using QuizApp.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace QuizApp.DAL.Repositories

// instructions on how to handle CRUD for User authentication.
{
    public class UserRepository : IUserRepository // we inherit the interface for user authentication
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }


        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
            .Include(u => u.Quizzes)
            .Include(u => u.QuizAttempts)
            .FirstOrDefaultAsync(u => u.UserId == userId);
        }
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await SaveChangesAsync();
        }
        public async Task<bool>DeleteUserAsync(int userId)
        {
            var user = await GetUserByIdAsync(userId);
            if (user == null) 
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync(); 
    }
}