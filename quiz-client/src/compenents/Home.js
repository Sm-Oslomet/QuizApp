import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Velkommen til Quiz App</h1>
      <p>Velg et alternativ for å fortsette:</p>

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
          ➕ Lag en ny quiz
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
          Velg en eksisterende quiz
        </button>
      </div>
    </div>
  );
}

export default Home;
