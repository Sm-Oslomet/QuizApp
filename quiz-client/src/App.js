// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateQuiz from "./compenents/CreateQuiz";
import SelectQuiz from "./compenents/SelectQuiz";
import Home from "./compenents/Home";
import QuizPlay from "./compenents/QuizPlay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/select" element={<SelectQuiz />} />
        <Route path="/play/:id" element = {<QuizPlay/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
