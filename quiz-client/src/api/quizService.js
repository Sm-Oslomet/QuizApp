import { authService } from "./authService";

const API_URL = `${process.env.REACT_APP_API_URL}/quiz`;

export const quizService = {
    async getAll() {
        const res = await fetch(API_URL, {
            headers: {
                "Content-Type": "application/json",
                ...authService.getAuthHeader(),
            },
        });
        if (!res.ok) throw new Error("Failed to load quizzes");
        return await res.json();
    },

    async getById(id) {
        const res = await fetch(`${API_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...authService.getAuthHeader(),
            },
        });
        if (!res.ok) throw new Error("Quiz not found");
        return await res.json();
    },

    async create(quiz) {
        const payload = {
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions.map(q => ({
                questionText: q.text,
                answers: q.options.map(o => ({
                    answerText: o,
                    isCorrect: o === q.correctAnswer,
                })),
            })),
        };

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authService.getAuthHeader(),
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create quiz");
        return data;
    },

    async update(id, quiz) {
        const payload = {
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions.map(q => ({
                questionText: q.text,
                answers: q.options.map(o => ({
                    answerText: o,
                    isCorrect: o === q.correctAnswer,
                })),
            })),
        };

        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authService.getAuthHeader(),
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update quiz");
        return data;
    },

    async remove(id) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { ...authService.getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to delete quiz");
        return await res.json();
    },

    async submit(quizId, userAnswers) {
        const payload = {
            quizId,
            userAnswers: userAnswers.map(a => ({
                questionId: a.questionId,
                answerId: a.answerId,
            })),
        };

        const res = await fetch(`${API_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authService.getAuthHeader(),
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to submit quiz");
        return data;
    },
};
