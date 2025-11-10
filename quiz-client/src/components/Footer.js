import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";


function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light text-center text-lg-start mt-5 border-top">
      <div className="container py-4">
        <div className="row align-items-center">
          {/* Venstre side – tekst */}
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <div className="fw-semibold">
              © {year} QuizApp by Gruppe Webapplikasjon ITPE3200
            </div>
            <small className="text-secondary">
              All rights reserved.
            </small>
          </div>

          {/* sosiale medier */}
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2 fs-4"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2 fs-4"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2 fs-4"
            >
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
