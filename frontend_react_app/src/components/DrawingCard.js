import React, { useState } from "react";
import { submitGuess } from "../services/backend";

function plural(n, s, s2) {
  return n === 1 ? s : (s2 ? s2 : s + "s");
}

// PUBLIC_INTERFACE
export default function DrawingCard({ drawing, featured = false }) {
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [wrongGuesses, setWrongGuesses] = useState(drawing.wrongGuesses || []);
  const hasGuessed =
    drawing && drawing.myGuess !== undefined && drawing.myGuess !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    setSubmitting(true);
    const result = await submitGuess(drawing.id, guess.trim());
    setSubmitting(false);
    setFeedback(result && result.correct ? "Correct!" : "Wrong guess");
    if (result && !result.correct) setWrongGuesses([...wrongGuesses, guess.trim()]);
    setGuess("");
    setTimeout(() => setFeedback(null), 1300);
  };

  return (
    <div
      className="card"
      style={{
        margin: featured ? "0 auto" : "",
        border: featured
          ? "3px solid var(--primary-2)"
          : "2px solid var(--primary-1)",
        boxShadow: featured
          ? "0 6px 30px #fbbf2475"
          : "0 2px 10px #4e73df1b",
        padding: "28px 20px 24px",
        borderRadius: featured ? "23px" : "17px",
        position: "relative",
        minHeight: 180,
        overflow: "hidden",
        transition: "box-shadow 0.33s, border-color 0.33s",
      }}
    >
      {/* Drawing image */}
      <div style={{
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      }}>
        {drawing.image ? (
          <img
            src={drawing.image}
            alt="User Drawing"
            style={{
              width: featured ? 175 : 136,
              borderRadius: featured ? 19 : 11,
              background:"var(--background-gradient)"
            }}
          />
        ) : (
          <div
            style={{
              width: featured ? 178 : 118,
              height: featured ? 145 : 108,
              background: "var(--background-flat)",
              borderRadius: featured ? 17 : 10,
              boxShadow: "0 2px 8px #6366f110",
            }}
          ></div>
        )}
      </div>
      {/* Sticky drawing title/owner */}
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: featured ? 19 : 16,
          color: "var(--accent-indigo)",
          margin: "11px 0 5px",
          letterSpacing: ".01em",
          textAlign: "center",
        }}
      >
        {drawing.ownerDisplay || "??? "}
        <span style={{fontFamily:"var(--font-alt-title)", marginLeft:7}}>🐾</span>
      </div>
      {featured && (
        <div
          style={{
            background: "var(--primary-2)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 20,
            padding: "3px 19px",
            margin: "0 auto 10px",
            width: "fit-content",
            boxShadow: "0 2px 4px #fbbf241c",
          }}
        >
          {drawing.guesses || 0} {plural(drawing.guesses || 0, "correct guess")}
        </div>
      )}

      {/* Guessing UI if not owner */}
      {drawing.guessable && !hasGuessed && (
        <form autoComplete="off" onSubmit={submit} style={{marginTop:17}}>
          <input
            type="text"
            value={guess}
            placeholder="Guess the animal..."
            maxLength={24}
            disabled={submitting}
            style={{
              border: "2px solid var(--primary-1)",
              borderRadius: 11,
              padding: "7px 13px",
              fontSize: 17,
              width: "65%",
            }}
            onChange={(e) => setGuess(e.target.value.replace(/[^a-zA-Z ]/g, ""))}
          />
          <button
            type="submit"
            disabled={submitting || !guess}
            style={{
              fontFamily:"var(--font-head)",
              background: "var(--accent-hot-pink)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              marginLeft: 12,
              fontSize: 17,
              padding:"7px 19px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            Guess
          </button>
        </form>
      )}
      {/* Feedback/animation */}
      {feedback && (
        <div
          style={{
            marginTop: 8,
            fontFamily:"var(--font-head)",
            color: feedback === "Correct!" ? "var(--accent-green)" : "var(--accent-hot-pink)",
            fontWeight:700,
            letterSpacing:".01em"
          }}
        >
          {feedback}
        </div>
      )}
      {/* Wrong guesses -- always visible */}
      <div
        style={{
          marginTop: featured ? 19 : 13,
          minHeight: 23,
          letterSpacing: ".01em",
          fontFamily:"var(--font-body)",
          fontSize:14,
          color:"var(--accent-hot-pink)",
          fontWeight:600
        }}
      >
        {wrongGuesses.length > 0 &&
          <>
            ❗ Wrong guesses:&nbsp;
            {wrongGuesses.slice(-3).map((g, i) => (
              <span key={i} style={{paddingRight:8}}>
                {g}
              </span>
            ))}
          </>
        }
      </div>
    </div>
  );
}
