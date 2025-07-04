import React from "react";

// PUBLIC_INTERFACE
export default function LoadingSpinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background-gradient)",
      }}
      aria-label="Loading"
    >
      <div className="spinner-pulse">
        <span role="img" aria-label="spinning-animal" style={{ fontSize: 60, filter: "drop-shadow(0 3px 12px #4e73df50)" }}>
          🦊
        </span>
      </div>
      <style>{`
        .spinner-pulse {
          animation: spinBounce 1s linear infinite alternate;
        }
        @keyframes spinBounce {
          0% { transform: scale(1) rotate(0deg);}
          50% { transform: scale(1.04) rotate(7deg);}
          85% { transform: scale(0.95) rotate(-11deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
      `}</style>
    </div>
  );
}
