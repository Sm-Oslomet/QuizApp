import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import UserList from "./UserList";
import QuizList from "./QuizList";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setQuizzes(JSON.parse(localStorage.getItem("quizzes")) || []);
  }, []);

  const deleteUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const deleteQuiz = (id) => {
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    localStorage.setItem("quizzes", JSON.stringify(updated));
  };

  return (
    <AdminLayout>
      <Sidebar active={activePage} onChange={setActivePage} />

      <div className="flex-grow-1 p-4">
        {activePage === "home" && (
          <DashboardHome users={users} quizzes={quizzes} />
        )}

        {activePage === "users" && (
          <UserList users={users} deleteUser={deleteUser} />
        )}

        {activePage === "quizzes" && (
          <QuizList quizzes={quizzes} deleteQuiz={deleteQuiz} />
        )}
      </div>
    </AdminLayout>
  );
}
