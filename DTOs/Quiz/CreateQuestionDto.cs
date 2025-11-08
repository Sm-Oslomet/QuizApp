﻿using QuizApp.Controllers;

namespace QuizApp.DTOs.Quiz
{
    public class CreateQuestionDto
    {
        public string QuestionText { get; set; } = string.Empty;
        public List<CreateAnswerDto> Answers { get; set; } = new();
    }
}