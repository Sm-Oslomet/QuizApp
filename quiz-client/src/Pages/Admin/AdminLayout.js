import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f8f9fa",
      }}
    >
      {children}
    </div>
  );
}
