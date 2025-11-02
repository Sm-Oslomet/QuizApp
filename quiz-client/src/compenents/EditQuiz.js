import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizService } from "../api/quizService"; 

function EditQuiz() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Load existing quiz from backend
    useEffect(() => {
        async function loadQuiz() {
            try {
                const data = await quizService.getById(id);

                const formatted = {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    questions: data.questions.map((q) => ({
                        id: q.id,
                        text: q.questionText,
                        options: q.answers.map((a) => a.answerText),
                        correctAnswer:
                            q.answers.find((a) => a.isCorrect)?.answerText || "",
                    })),
                };

                // ensure each question has exactly 4 options
                formatted.questions = formatted.questions.map((q) => ({
                    ...q,
                    options: [...q.options, "", "", "", ""].slice(0, 4),
                }));

                setQuiz(formatted);
            } catch (err) {
                alert("Quiz not found.");
                navigate("/select");
            } finally {
                setLoading(false);
            }
        }

        loadQuiz();
    }, [id, navigate]);

    // ✅ Find which option index is correct
    const correctIndexes = useMemo(() => {
        if (!quiz) return [];
        return quiz.questions.map((q) =>
            Math.max(0, q.options.findIndex((o) => o === q.correctAnswer))
        );
    }, [quiz]);

    // ✅ Change which answer is correct
    const setCorrectIndex = (questionIndex, optionIndex) => {
        setQuiz((prev) => {
            const updated = { ...prev };
            const question = { ...updated.questions[questionIndex] };
            question.correctAnswer = question.options[optionIndex] || "";
            updated.questions = updated.questions.map((q, i) =>
                i === questionIndex ? question : q
            );
            return updated;
        });
    };

    // ✅ Update title or description
    const handleMeta = (field, value) =>
        setQuiz((q) => ({ ...q, [field]: value }));

    // ✅ Update question text
    const handleQuestionText = (index, value) => {
        setQuiz((prev) => {
            const updated = { ...prev };
            updated.questions[index].text = value;
            return updated;
        });
    };

    // ✅ Update an answer option
    const handleOption = (qi, oi, value) => {
        setQuiz((prev) => {
            const updated = { ...prev };
            const question = { ...updated.questions[qi] };
            const options = [...question.options];
            const wasCorrect = question.correctAnswer === options[oi];
            options[oi] = value;
            question.options = options;
            if (wasCorrect) question.correctAnswer = value;
            updated.questions[qi] = question;
            return updated;
        });
    };

    // ✅ Add or remove questions
    const addQuestion = () => {
        setQuiz((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                { text: "", options: ["", "", "", ""], correctAnswer: "" },
            ],
        }));
    };

    const removeQuestion = (index) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    };

    // ✅ Save changes to backend
    const handleSave = async () => {
        if (!quiz.title.trim()) {
            alert("Please enter a title.");
            return;
        }

        const cleaned = {
            title: quiz.title.trim(),
            description: (quiz.description || "").trim(),
            questions: quiz.questions.map((q) => ({
                text: q.text.trim(),
                options: q.options.map((o) => o.trim()),
                correctAnswer: (q.correctAnswer || "").trim(),
            })),
        };

        if (
            cleaned.questions.some(
                (q) => !q.text || q.options.some((o) => !o) || !q.correctAnswer
            )
        ) {
            alert(
                "Each question must have text, four options, and a selected correct answer."
            );
            return;
        }

        try {
            await quizService.update(id, cleaned);
            alert("✅ Quiz updated successfully!");
            navigate("/select");
        } catch (err) {
            alert(err.message || "Failed to save quiz.");
        }
    };

    if (loading) return <p className="text-center mt-5">Loading quiz...</p>;
    if (!quiz) return <p className="text-center mt-5 text-danger">Quiz not found.</p>;

    return (
        <div className="container py-5">
            <h2 className="text-center text-primary mb-4">✏️ Edit Quiz</h2>

            {/* Quiz title and description */}
            <div className="card shadow-sm p-4 mb-4">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                        className="form-control"
                        value={quiz.title}
                        onChange={(e) => handleMeta("title", e.target.value)}
                    />
                </div>
                <div>
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={quiz.description || ""}
                        onChange={(e) => handleMeta("description", e.target.value)}
                    />
                </div>
            </div>

            {/* Questions list */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Questions</h5>
                <button className="btn btn-outline-primary btn-sm" onClick={addQuestion}>
                    Add Question
                </button>
            </div>

            {quiz.questions.map((q, qi) => (
                <div className="card mb-3" key={qi}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <input
                                className="form-control me-2"
                                value={q.text}
                                onChange={(e) => handleQuestionText(qi, e.target.value)}
                                placeholder={`Question ${qi + 1}`}
                            />
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeQuestion(qi)}
                            >
                                Delete
                            </button>
                        </div>

                        <div className="row g-2">
                            {q.options.map((opt, oi) => (
                                <div className="col-sm-6" key={oi}>
                                    <div className="input-group">
                                        <div className="input-group-text">
                                            <input
                                                type="radio"
                                                name={`correct-${qi}`}
                                                className="form-check-input mt-0"
                                                checked={correctIndexes[qi] === oi}
                                                onChange={() => setCorrectIndex(qi, oi)}
                                                title="Mark as correct"
                                            />
                                        </div>
                                        <input
                                            className="form-control"
                                            value={opt}
                                            onChange={(e) => handleOption(qi, oi, e.target.value)}
                                            placeholder={`Option ${oi + 1}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <small className="text-muted d-block mt-2">
                            Correct answer:{" "}
                            <strong>{q.correctAnswer || "– not selected –"}</strong>
                        </small>
                    </div>
                </div>
            ))}

            {/* Action buttons */}
            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-secondary" onClick={() => navigate("/select")}>
                    Back
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default EditQuiz;
