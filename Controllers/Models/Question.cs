using System.Collections.Generic;

namespace QuizApp.Models
{
    public class Question
    {
        public string Text { get; set; } = "";
        public List<string> Options { get; set; } = new();
        public string CorrectAnswer { get; set; } = "";
    }
}
