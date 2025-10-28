using Microsoft.AspNetCore.Identity;

namespace QuizApp.Models;

public class User : IdentityUser
{
    // we inherit many needed fields from IdentityUser
    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}
