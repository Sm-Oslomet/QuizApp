using QuizApp.Models;

namespace QuizApp.DAL.Interfaces
{
    // We create an interface to handle CRUD for Authentication of Users
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int userId); // we set up an async method to fetch a user by their id
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByResetTokenAsync(string Token);

        Task CreateUserAsync(User user); // could've called them just "create" but this could lead to confusion since we have 3 repositories that will each have multuple "create" methods
        Task UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int UserId); // boolean to avoid running into errors/having to write extra code if a user doesn't exist
        Task SaveChangesAsync();
    }
}