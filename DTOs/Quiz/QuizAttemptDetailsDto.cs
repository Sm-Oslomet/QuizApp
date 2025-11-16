using Microsoft.EntityFrameworkCore.Storage;

namespace QuizApp.DTOs.Quiz
{
    public class QuizAttemptDetailsDto
    {
        public int AttemptId {get;set;}
        public int QuizId {get;set;}
        public string QuizTitle {get;set;} = string.Empty;
        public int Score {get;set;}
        public int TotalQuestions {get;set;}
        public DateTime AttemptedAt {get;set;}
        public List<AttemptAnswerDto> Answers {get;set;} = new();
    }
}