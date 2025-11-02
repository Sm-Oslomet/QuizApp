// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./compenents/Home";
import CreateQuiz from "./compenents/CreateQuiz";
import SelectQuiz from "./compenents/SelectQuiz";
import QuizPlay from "./compenents/QuizPlay";
import EditQuiz from "./compenents/EditQuiz";
import Footer from "./compenents/Footer";
import Navbar from "./compenents/Navbar";
import ResultPage from "./compenents/ResultPage";
import Login from "./compenents/Login/Login";
import Register from "./compenents/Login/Register";
import RequireAuth from "./compenents/Login/RequireAuth";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js";


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light py-5">
          <div className="container">
            <Routes>
              {/* Offentlige sider */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Beskyttede sider */}
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
                path="/play/:id"
                element={
                  <RequireAuth>
                    <QuizPlay />
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
                path="/result/:id"
                element={
                  <RequireAuth>
                    <ResultPage />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;