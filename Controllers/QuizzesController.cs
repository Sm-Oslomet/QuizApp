using Microsoft.AspNetCore.Mvc;
using QuizApp.Models;  // 
using System.Collections.Generic;
using System.Linq;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private static List<Quiz> quizzes = new List<Quiz>
        {
            new Quiz
            {
                Id = "1",
                Title = "Math Quiz",
                Description = "Basic math questions",
                Questions = new List<Question>
                {
                    new Question
                    {
                        Text = "What is 2 + 2?",
                        Options = new List<string> { "1", "2", "3", "4" },
                        CorrectAnswer = "4"
                    }
                }
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Quiz>> GetAll()
        {
            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public ActionResult<Quiz> GetOne(string id)
        {
            var quiz = quizzes.FirstOrDefault(q => q.Id == id);
            if (quiz == null)
                return NotFound(new { error = "Quiz not found" });
            return Ok(quiz);
        }

        [HttpPost]
        public ActionResult<Quiz> Create([FromBody] Quiz newQuiz)
        {
            newQuiz.Id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
            quizzes.Add(newQuiz);
            return CreatedAtAction(nameof(GetOne), new { id = newQuiz.Id }, newQuiz);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var before = quizzes.Count;
            quizzes = quizzes.Where(q => q.Id != id).ToList();
            if (quizzes.Count == before)
                return NotFound(new { error = "Quiz not found" });
            return Ok(new { message = "Deleted", id });
        }
    }
}
