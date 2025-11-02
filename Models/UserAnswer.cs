namespace QuizApp.Models
{


    // join table for Question and Answer
    public class UserAnswer
    {
        public int UserAnswerId { get; set; }

        public int QuizAttemptId { get; set; }
        public QuizAttempt QuizAttempt { get; set; } = null!;

        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;

        public int AnswerId { get; set; }
        public Answer Answer { get; set; } = null!;

    }
}