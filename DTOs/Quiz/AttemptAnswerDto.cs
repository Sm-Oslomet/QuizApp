namespace QuizApp.DTOs.Quiz
{
    public class AttemptAnswerDto
    {
        public string QuestionText {get;set;} = string.Empty;
        public string SelectedAnswer {get;set;} = string.Empty;
        public bool IsCorrect {get;set;}
    }
}