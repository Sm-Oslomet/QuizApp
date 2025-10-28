namespace QuizApp.Models;

public class UserAnswer
{
    public int AnsId { get; set; }
    public int Score { get; set; }
    public DateTime TakenAt { get; set; }

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

}