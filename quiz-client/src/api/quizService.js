import $ from "jquery";
import { authService } from "../services/authService.js";

const API_URL = "http://localhost:5251/api/quiz";

function getAuthHeader(){
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}`} : {};
}

const quizService = {
  async getAll(){
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        ...getAuthHeader(),
      },
    });

    if(!res.ok) throw new Error("Failed to get quizzes");
    return await res.json();
  },

  async getById(id){
    const res = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers:{
        "Content-Type" : "application/json",
        ...getAuthHeader(),
      },
    });

    if (!res.ok) throw new Error("Failed to get quiz");
    return await res.json();
  },

  async create(quiz){
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(quiz),
    });
    if(!res.ok) throw new Error("Failed to create quiz");
  },

  async update(id, quiz){
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(quiz),
    });

    if(!res.ok) {
      const errorText = await res.text();
      let message = "Failed to update quiz";
      try {
        const data = JSON.parse(errorText);
        message = data.message || message;
      } catch {
        message = errorText || message;
      }
      throw new Error(message);
    }
  },

  async remove(id){
    const res = await fetch(`${API_URL}/${id}`,{
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    });
    if(!res.ok) {
      const errorText = await res.text();
      let message = "Failed to delete quiz";
      try {
        const data = JSON.parse(errorText);
        message = data.message || message;
      } catch {
        message = errorText || message;
      }
      throw new Error(message)
    }
    return await res.json().catch(() => ({}));
  },

  async submit(attempt){
    const res = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(attempt),
    });
    if(!res.ok) throw new Error("Failed to submit attempt");
    return await res.json();
  },
};
export default quizService;


// API mode (AJAX)
/*
async function apiGetAll() {
  return $.ajax({ url: API_URL, type: "GET" });
}

async function apiGetOne(id) {
  return $.ajax({ url: `${API_URL}/${id}`, type: "GET" });
}

async function apiCreate(quiz) {
  return $.ajax({
    url: API_URL,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(quiz),
  });
}

async function apiUpdate(id, quiz) {
  return $.ajax({
    url: `${API_URL}/${id}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(quiz),
  });
}

async function apiDelete(id) {
  return $.ajax({ url: `${API_URL}/${id}`, type: "DELETE" });
}

// LocalStorage mode
function lsGetAll() {
  return Promise.resolve(JSON.parse(localStorage.getItem("quizzes") || "[]"));
}

function lsGetOne(id) {
  const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const found = all.find((q) => q.id === id);
  return Promise.resolve(found || null);
}

function lsCreate(quiz) {
  const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const newQuiz = { ...quiz, id: crypto.randomUUID() };
  localStorage.setItem("quizzes", JSON.stringify([...all, newQuiz]));
  return Promise.resolve(newQuiz);
}

function lsUpdate(id, quiz) {
  const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const idx = all.findIndex((q) => q.id === id);
  if (idx === -1) return Promise.reject("Quiz not found");
  all[idx] = { ...quiz, id };
  localStorage.setItem("quizzes", JSON.stringify(all));
  return Promise.resolve(all[idx]);
}

function lsDelete(id) {
  const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const updated = all.filter((q) => q.id !== id);
  localStorage.setItem("quizzes", JSON.stringify(updated));
  return Promise.resolve();
}
// Velg modus
export const quizService = {
  getAll: USE_API ? apiGetAll : lsGetAll,
  getOne: USE_API ? apiGetOne : lsGetOne,
  create: USE_API ? apiCreate : lsCreate,
  update: USE_API ? apiUpdate : lsUpdate,
  remove: USE_API ? apiDelete : lsDelete,
};
*/