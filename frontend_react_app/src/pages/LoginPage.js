import React, { useState } from "react";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [spinning, setSpinning] = useState(false);
  const { doAnonymousLogin, loading } = React.useContext(AuthContext);

  const startLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || loading) return;
    setSpinning(true);
    await doAnonymousLogin(username);
    // After auth, upstream will redirect to dashboard.
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background-gradient)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <div
          className="spinning-mascot"
          style={{
            fontSize: 90,
            filter: "drop-shadow(0 8px 36px #4e73df40)",
            transition: "transform 0.46s cubic-bezier(.51,1.56,.74,-0.36)",
            transform: spinning
              ? "rotate(1.5turn) scale(1.2)"
              : "rotate(0deg) scale(1.0)",
          }}
        >
          <span role="img" aria-label="animal-fox">
            🦊
          </span>
        </div>
      </div>
      <h1 className="app-heading app-font-alt-title" style={{ fontSize: 44, marginBottom: 12 }}>
        DoodleFinder
      </h1>
      <form
        style={{
          background: "#fff",
          boxShadow: "var(--app-shadow)",
          borderRadius: "var(--border-radius)",
          padding: 36,
          minWidth: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={startLogin}
      >
        <label
          htmlFor="username"
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 600,
            fontSize: 18,
            color: "var(--primary-1)",
            marginBottom: 10,
          }}
        >
          Pick your username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          autoFocus
          maxLength={18}
          onChange={(e) =>
            setUsername(e.target.value.replace(/[^\w\d_ -]/g, ""))
          }
          placeholder="Type username"
          disabled={spinning || loading}
          style={{
            fontSize: 18,
            borderRadius: 7,
            border: "2px solid var(--primary-1)",
            padding: "8px 16px",
            marginBottom: 20,
            width: 200,
            textAlign: 'center'
          }}
        />
        <button
          type="submit"
          className="fab"
          style={{
            fontSize: 18,
            marginTop: 10,
            border: "none",
            borderRadius: "11px",
            padding: "12px 34px",
            transition: "transform 0.2s",
            boxShadow: "var(--fab-shadow)",
            cursor:
              username.trim().length < 3 || spinning || loading
                ? "not-allowed"
                : "pointer",
            opacity:
              username.trim().length < 3 || spinning || loading ? 0.6 : 1.0,
          }}
          disabled={username.trim().length < 3 || spinning || loading}
        >
          {spinning ? "Ready..." : "Start"}
        </button>
      </form>
      <style>{`
        .spinning-mascot {
          animation: ${
            spinning
              ? "mascot-spin 0.65s cubic-bezier(.51,1.56,.74,-0.36)"
              : "none"
          };
        }
        @keyframes mascot-spin {
          0% { transform: scale(1) rotate(0deg);}
          70% { transform: scale(1.27) rotate(280deg);}
          100% { transform: scale(1.2) rotate(540deg);}
        }
      `}</style>
    </div>
  );
}
