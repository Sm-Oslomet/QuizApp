using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QuizApp.DAL.Interfaces;
using QuizApp.DTOs.Auth;
using QuizApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace QuizApp.Controllers
{
    [ApiController] // auto model validation and error handling
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserRepository _userRepo; 
        private readonly IConfiguration _configuration; // used to access jwt  

        public AccountController(IUserRepository userRepo, IConfiguration configuration) // dependency injection
        {
            _userRepo = userRepo;
            _configuration = configuration;
        }

        [HttpPost("register")] //Handles POST /api/account/register
        public async Task<IActionResult> Register([FromBody] RegisterDto request) // takes a json body and maps it to ReigsterDto
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data" });

            // Checks for existing username, to avoid duplicates
            var existingUser = await _userRepo.GetUserByUsernameAsync(request.Username);
            if (existingUser != null)
                return BadRequest(new { message = "Username already exists" });

            var user = new User // we create a new user object
            {
                Username = request.Username,
                PasswordHash = HashPassword(request.Password) // Store the password after hashing it
            };

            await _userRepo.CreateUserAsync(user); // asynchroniously adds user to the database
            await _userRepo.SaveChangesAsync();

            var token = GenerateJwtToken(user); // token generated after registering user

            return Ok(new // returns response for successful registration
            {
                token,
                username = user.Username,
                userId = user.UserId
            });
        }

        [HttpPost("login")] // Handles POST /api/account/login
        public async Task<IActionResult> Login([FromBody] LoginDto request) // login form expects username and password
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data" });

            var user = await _userRepo.GetUserByUsernameAsync(request.Username);
            if (user == null) // checks for an existing username
                return Unauthorized(new { message = "Invalid username or password" });

            var hashedPassword = HashPassword(request.Password);
            if (user.PasswordHash != hashedPassword) // checks for a matching password
                return Unauthorized(new { message = "Invalid username or password" });

            var token = GenerateJwtToken(user); // returns a JWT token, username and userId for a successful login 

            return Ok(new
            {
                token,
                username = user.Username,
                userId = user.UserId
            });
        }

        // Code used to generate JWT token, which was written with the assistance of ai
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes( //symmetric key, same for signing in and verification
                _configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256); // uses HMAC SHA-256 to sign the token

            var claims = new[]
            { // we encode claims into the jwt
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // user ID
                new Claim(ClaimTypes.Name, user.Username), // username
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // unique token ID
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "QuizSystemAPI",
                audience: _configuration["Jwt:Audience"] ?? "QuizSystemClient",
                claims: claims,
                expires: DateTime.Now.AddDays(7), // tokin valid for 7 days
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token); // converts token object into jwt string
        }

        private string HashPassword(string password) // method to hash the password
        {
            using (var sha256 = SHA256.Create()) // we use SHA-256 for encryption
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
