using System.Collections.Generic;

namespace QuizApp.Models
{
    public class Quiz
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public List<Question> Questions { get; set; } = new();
    }
}
