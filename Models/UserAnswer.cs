namespace QuizApp.Models;


// join table for Question and Answer
public class UserAnswer
{
    public class UserAnswer
    {
        public int Id { get; set; }

        public int QuizAttemptId { get; set; }
        public virtual QuizAttempt QuizAttempt { get; set; }

        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }

        public int AnswerId { get; set; }
        public virtual Answer Answer { get; set; }
    }
}
