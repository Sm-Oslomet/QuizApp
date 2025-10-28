import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Quiz App</h1>
      <p>Select an option to continue:</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/create")}
          style={{
            padding: "12px 24px",
            margin: "10px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Create a New Quiz
        </button>

        <button
          onClick={() => navigate("/select")}
          style={{
            padding: "12px 24px",
            margin: "10px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Choose an Existing Quiz
        </button>
      </div>
    </div>
  );
}

export default Home;
