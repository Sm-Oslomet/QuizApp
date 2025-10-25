// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./compenents/Home";
import CreateQuiz from "./compenents/CreateQuiz";
import SelectQuiz from "./compenents/SelectQuiz";
import QuizPlay from "./compenents/QuizPlay";
import EditQuiz from "./compenents/EditQuiz";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./compenents/Footer";
import Navbar from "./compenents/Navbar";


function App() {
  

  return (
   <Router>
    <Navbar/>      
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<CreateQuiz/>} />
          <Route path="/select" element={<SelectQuiz />} />
          <Route path="/play/:id" element={<QuizPlay />} />
          <Route path="/edit/:id" element={<EditQuiz />} />
        </Routes>
      </main>
       {/* Footer at the bottom */}
      <Footer />
    </Router>
  );
}

export default App;
