import $ from "jquery";

const API_URL = "http://localhost:5000/api/quizzes";
const USE_API = false; // Endre til true når du vil bruke server (API)


// API mode (AJAX)

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
