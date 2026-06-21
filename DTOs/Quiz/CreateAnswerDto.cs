﻿namespace QuizApp.DTOs.Quiz
{
    public class CreateAnswerDto
    {
        public string AnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}