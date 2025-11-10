import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "../../api/quizService";
import {authService} from "../../services/authService";

function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectionMap, setSelectionMap] = useState({});
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [wasCorrect, setWasCorrect] = useState(null); // true / false / null
  const [loading, setLoading] = useState(true);

  // last riktig quiz fra localStorage
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if(!currentUser){
      navigate("/login");
      return;
    }
    const getQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getById(id);

        const mapped = {
          id: data.quizId || data.QuizId || data.QuizID || id,
          title: data.title || data.Title,
          questions: (data.questions || data.Questions || []).map((q)=> ({
            questionId: q.questionId || q.QuestionId,
            text: q.questionText || q.QuestionText,
            answers: (q.answers || q.Answers ||[]).map((a)=> ({
              answerId: a.answerId || a.answerId,
              text: a.answerText || a.AnswerText,

              iscorrect: a.isCorrect ?? a.IsCorrect ?? false
            }))
          }))
        };
        setQuiz(mapped);
      } catch (err) {alert("Failed to load quiz");
        navigate("/select");
      } finally {setLoading(false);}
    };

    
    getQuiz();
  }, [id, navigate]);
  useEffect(()=> {
    if(selectedAnswerId != null){
      const qid = question.questionId;
      setSelectionMap((m)=> ({ ...m, [qid]: selectedAnswerId}));
      }
    }, [selectedAnswerId, quiz, current]);
  if(loading)return <p className="text-center mt-5">Loading quiz</p>;
  if(!quiz) return<p className="text-center m-5">Quiz not found</p>;


  const question = quiz.questions[current];
  const livePercentage = Math.round(
    (score / quiz.questions.length) * 100
  );

  // Når bruker klikker på et svar
  const handleAnswer = (answer) => {
    if (selectedAnswerId) return; // ikke la bruker velge på nytt

    setSelectedAnswerId(answer.answerId);
    setSelectionMap((m) => ({...m, [question.questionId]: answer.answerId}));

    const immediatelyCorrect = answer.isCorrect;

    if(immediatelyCorrect) {
      setScore((prev)=> prev+1);
      setFeedbackText("Correct!");
      setWasCorrect(true);
    }else {
      setFeedbackText("Selected");
      setFeedbackText("Choice recorded");
      setWasCorrect(false);
    }
  };
    const handleNextOrFinish = async () => {
      const lastIndex = quiz.questions.length - 1;
      if(current <lastIndex) {
        setCurrent((prev)=> prev+1);
        setSelectedAnswerId(null);
        setFeedbackText("");
        setWasCorrect(null);
      } else {
        const userAnswers = quiz.questions.map((q)=> ({
          questionId: q.questionId,
          answerId: selectionMap[q.questionId] || 0
        }));

        try {
          const attemptPayload = {
            quizId: parseInt(quiz.id, 10),
            userAnswers
          };

          const res = await quizService.submit(attemptPayload);

          navigate(`/result/${res.attemptId}`,{
            state: {
              quizId: quiz.id,
              title: quiz.title,
              totalQuestions: res.totalQuestions || res.totalQuestions,
              score: res.score,
              percentage: res.percentage
            }
          });
        } catch (err){ alert("Failed to submit attempt");
        }
      }
    }

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">
        {quiz.title}
      </h2>

      {/* topp-linje med fremdrift og score */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold">
          Question {current + 1} / {quiz.questions.length}
        </span>
        <span className="text-success fw-bold">
          Score: {score} ({livePercentage}%)
        </span>
      </div>

      <div className="card shadow p-4">
        <p className="fw-bold">{question.text}</p>

        <div className="list-group">
          {question.answers.map((option, i) => {
            let buttonClass =
              "list-group-item list-group-item-action";

            const selectedForThisQuestion = selectionMap[question.questionId];

            if(selectedForThisQuestion) {
              if(option.answerId === selectedForThisQuestion){

                buttonClass += option.isCorrect
                  ? " list-group-item-success"
                  : " list-group-item-danger";
              } else {
                buttonClass += "disabled opacity-50";
              }
            }

            return (
              <button
                key={i}
                className={buttonClass}
                onClick={ () => {
                  setSelectedAnswerId(option.answerId);
                  setSelectionMap((m)=> ({ ...m, [question.questionId]: option.answerId}));
                  if (option.isCorrect){
                    setScore((s)=> s+1);
                    setFeedbackText("Correct!");
                    setWasCorrect(true);
                  } else {
                    setFeedbackText("Choice recorded");
                    setWasCorrect(false);
                  }
                }}
                onClickCapture={()=> handleAnswer(option)}
                disabled={!!selectionMap[question.questionId]}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        {/* feedback-tekst etter brukeren har svart */}
        {feedbackText && (
          <div
            className={`alert mt-3 text-center ${
              wasCorrect ? "alert-success" : "alert-danger"
            }`}
          >
            {feedbackText}
          </div>
        )}

        {/* Neste-knapp vises bare etter svar */}
        {selectionMap[question.questionId] && (
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={handleNextOrFinish}
            >
              {current + 1 < quiz.questions.length
                ? "➡️ Next Question"
                : "🏁 See Results"}
            </button>
          </div>
        )}
      </div>

      {/* Tilbake til select (hvis de vil rage-quit 🤭) */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/select")}
        >
          ⬅ Back to quiz list
        </button>
      </div>
    </div>
  );
}

export default QuizPlay;
