using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;

namespace QuizApp.Models;
public class Question
{
    public int QuestionId { get; set; } //Primary Key
    public string Text { get; set; } = string.Empty;
    public int QuizId { get; set; } // Foreign Key linking to Quiz
    public Quiz Quiz { get; set; } = null!;
    public ICollection<Option> Options { get; set; } = new List<Option>();
}
