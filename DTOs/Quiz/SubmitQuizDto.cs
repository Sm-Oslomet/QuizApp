﻿namespace QuizApp.DTOs.Quiz
{
    public class SubmitQuizDto
    {
        public int QuizId { get; set; }
        public List<UserAnswerDto> UserAnswers { get; set; } = new();
    }
}