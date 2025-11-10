// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

// Quiz pages
import CreateQuiz from "./Pages/Quiz/CreateQuiz";
import SelectQuiz from "./Pages/Quiz/SelectQuiz";
import EditQuiz from "./Pages/Quiz/EditQuiz";
import QuizPlay from "./Pages/Quiz/QuizPlay";
import ResultPage from "./Pages/Quiz/ResultPage";

// Protected
import RequireAuth from "./Pages/Protected/RequireAuth";
import AdminRoute from "./Pages/Protected/AdminRoute";
import NotAuthorized from "./Pages/Protected/NotAuthorized";

// Admin
import Dashboard from "./Pages/Admin/Dashboard";

// CSS + Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1 bg-light py-5">
          <div className="container">
            <Routes>

              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* User protected routes */}
              <Route
                path="/create"
                element={
                  <RequireAuth>
                    <CreateQuiz />
                  </RequireAuth>
                }
              />

              <Route
                path="/select"
                element={
                  <RequireAuth>
                    <SelectQuiz />
                  </RequireAuth>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <RequireAuth>
                    <EditQuiz />
                  </RequireAuth>
                }
              />

              <Route
                path="/play/:id"
                element={
                  <RequireAuth>
                    <QuizPlay />
                  </RequireAuth>
                }
              />

              <Route
                path="/result/:id"
                element={
                  <RequireAuth>
                    <ResultPage />
                  </RequireAuth>
                }
              />

              {/* Admin protected routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />

              <Route path="/not-authorized" element={<NotAuthorized />} />

            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
