import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "../api/quizService"; 

function QuizPlay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [wasCorrect, setWasCorrect] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Load quiz from backend
    useEffect(() => {
        async function loadQuiz() {
            try {
                const formatted = await quizService.getById(id);
                setQuiz(formatted);
            } catch (err) {
                alert("Quiz not found!");
                navigate("/select");
            } finally {
                setLoading(false);
            }
        }
        loadQuiz();
    }, [id, navigate]);


    if (loading) {
        return <p className="text-center mt-5">Loading quiz...</p>;
    }

    if (!quiz) {
        return <p className="text-center mt-5 text-danger">Quiz not found.</p>;
    }

    const question = quiz.questions[current];
    const livePercentage = Math.round((score / quiz.questions.length) * 100);

    const handleAnswer = (option) => {
        if (selected) return;

        setSelected(option);
        // ✅ also record this choice inside quiz.questions
        setQuiz((prev) => {
            const updated = [...prev.questions];
            updated[current].selectedOption = option;
            return { ...prev, questions: updated };
        });

        if (option === question.answers.find((a) => a.isCorrect)?.text) {
            setScore((prev) => prev + 1);
            setFeedbackText("✅ Correct!");
            setWasCorrect(true);
        } else {
            setFeedbackText(
                `❌ Wrong! Correct answer: ${question.answers.find((a) => a.isCorrect)?.text
                }`
            );
            setWasCorrect(false);
        }
    };

    const handleNext = async () => {
        const lastIndex = quiz.questions.length - 1;

        if (current < lastIndex) {
            setCurrent((prev) => prev + 1);
            setSelected(null);
            setFeedbackText("");
            setWasCorrect(null);
        } else {
            try {
                // ✅ Collect correct answer IDs
                const userAnswers = quiz.questions.map((q) => {
                    const selectedAnswer = q.answers.find(
                        (a) => a.text === q.selectedOption // store selected option per question
                    );
                    return {
                        questionId: q.id,
                        answerId: selectedAnswer ? selectedAnswer.id : null,
                    };
                });

                const result = await quizService.submit(quiz.id, userAnswers);

                navigate(`/result/${quiz.id}`, {
                    state: {
                        title: quiz.title,
                        totalQuestions: result.totalQuestions,
                        score: result.score,
                    },
                });
            } catch (err) {
                alert("Failed to submit quiz result: " + err.message);
            }
        }
    };


    return (
        <div className="container py-5">
            <h2 className="text-center text-primary mb-4">{quiz.title}</h2>

            {/* top bar: progress + score */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">
                    Question {current + 1} / {quiz.questions.length}
                </span>
                <span className="text-success fw-bold">
                    Score: {score} ({livePercentage}%)
                </span>
            </div>

            {/* Question card */}
            <div className="card shadow p-4">
                <p className="fw-bold">{question.text}</p>

                <div className="list-group">
                    {question.answers.map((a, i) => {
                        let buttonClass = "list-group-item list-group-item-action";

                        if (selected) {
                            if (a.text === question.answers.find(ans => ans.isCorrect)?.text) {
                                buttonClass += " list-group-item-success";
                            } else if (a.text === selected) {
                                buttonClass += " list-group-item-danger";
                            } else {
                                buttonClass += " disabled opacity-50";
                            }
                        }

                        return (
                            <button
                                key={a.id}
                                className={buttonClass}
                                onClick={() => handleAnswer(a.text)}
                                disabled={!!selected}
                            >
                                {a.text}
                            </button>
                        );
                    })}

                </div>

                {/* Feedback text after answering */}
                {feedbackText && (
                    <div
                        className={`alert mt-3 text-center ${wasCorrect ? "alert-success" : "alert-danger"
                            }`}
                    >
                        {feedbackText}
                    </div>
                )}

                {/* Next button */}
                {selected && (
                    <div className="text-center mt-3">
                        <button className="btn btn-primary" onClick={handleNext}>
                            {current + 1 < quiz.questions.length
                                ? "➡️ Next Question"
                                : "🏁 See Results"}
                        </button>
                    </div>
                )}
            </div>

            {/* Back button */}
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
