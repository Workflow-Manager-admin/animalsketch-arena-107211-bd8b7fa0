import React from "react";

// PUBLIC_INTERFACE
export default function FabButton({ icon, label, onClick, style }) {
  return (
    <button
      className="fab"
      style={{
        position: "fixed",
        right: 30,
        bottom: 30,
        fontSize: 34,
        borderRadius: 70,
        padding: 0,
        minWidth: 72,
        minHeight: 72,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--fab-shadow)",
        cursor: "pointer",
        ...style,
      }}
      aria-label={label || "Add"}
      onClick={onClick}
    >
      {icon ? icon : <span>+</span>}
    </button>
  );
}
