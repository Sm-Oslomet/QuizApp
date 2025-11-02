using QuizApp.Controllers;

namespace QuizApp.DTOs.Quiz
{
    public class CreateQuizDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<CreateQuestionDto> Questions { get; set; } = new();
    }
}