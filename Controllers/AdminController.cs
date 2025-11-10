using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL.Interfaces;

namespace QuizApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IQuizRepository _quizRepository;

        public AdminController(IUserRepository userRepository, IQuizRepository quizRepository)
        {
            _userRepository = userRepository;
            _quizRepository = quizRepository;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userRepository.DeleteUserAsync(id);
            if (!result) return NotFound("User not found");
            return Ok("User deleted");
        }

        [HttpGet("quizzes")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _quizRepository.GetAllQuizzesAsync();
            return Ok(quizzes);
        }
    }
}