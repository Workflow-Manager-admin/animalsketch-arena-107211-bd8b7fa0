import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitDrawing, getAnimalPrompt } from "../services/backend";
import LoadingSpinner from "../components/LoadingSpinner";

// PUBLIC_INTERFACE
export default function DrawingPage() {
  const [prompt, setPrompt] = useState(null);
  const [spinning, setSpinning] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [timer, setTimer] = useState(45); // seconds to draw
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef();
  const [imageData, setImageData] = useState(null);
  const navigate = useNavigate();

  // Pick animal prompt and animate spinning
  useEffect(() => {
    async function spinPrompt() {
      setSpinning(true);
      setPrompt(null);
      const p = await getAnimalPrompt();
      setTimeout(() => {
        setPrompt(p.prompt || p);
        setSpinning(false);
      }, 1050);
    }
    spinPrompt();
  }, []);

  // Timer logic after drawing starts
  useEffect(() => {
    if (drawing && timer > 0 && !submitted) {
      const id = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(id);
    }
    if (timer === 0 && drawing && !submitted) {
      handleSubmit();
    }
  }, [drawing, timer, submitted]);

  // Drawing methods (simple touch/mouse canvas)
  const draw = (ctx, x, y) => {
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const onCanvasPointerDown = (e) => {
    if (submitted || spinning) return;
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    );
    document.addEventListener("mousemove", onCanvasPointerMove);
    document.addEventListener("mouseup", onCanvasPointerUp);
    document.addEventListener("touchmove", onCanvasPointerMove);
    document.addEventListener("touchend", onCanvasPointerUp);
  };
  const onCanvasPointerMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
    draw(
      ctx,
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    );
  };
  const onCanvasPointerUp = (e) => {
    setDrawing(false);
    document.removeEventListener("mousemove", onCanvasPointerMove);
    document.removeEventListener("mouseup", onCanvasPointerUp);
    document.removeEventListener("touchmove", onCanvasPointerMove);
    document.removeEventListener("touchend", onCanvasPointerUp);
    if (canvasRef.current) {
      setImageData(canvasRef.current.toDataURL("image/png"));
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setImageData(null);
  };

  // Submits the drawing
  const handleSubmit = async () => {
    if (submitted || spinning) return;
    if (!imageData) {
      setError("Draw something!");
      setTimeout(() => setError(""), 1200);
      return;
    }
    setSubmitted(true);
    await submitDrawing({ prompt, image: imageData });
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  if (spinning || !prompt) return <LoadingSpinner />;
  if (submitted)
    return (
      <div style={{
        minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"
      }}>
        <h2 style={{fontFamily:"var(--font-head)", color:"var(--primary-1)",marginBottom: 24}}>Drawing submitted!</h2>
        <div style={{fontSize:54}} role="img" aria-label="success">🎉</div>
      </div>
    );
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background-gradient)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 40,
      }}
    >
      <h1 className="app-heading" style={{ color: "var(--primary-1)",fontSize:32 }}>
        Draw this animal:
      </h1>
      <div
        style={{
          fontFamily: "var(--font-alt-title)",
          fontSize: 36,
          margin: "12px 0 12px",
          color: "var(--accent-hot-pink)",
          padding: "6px 28px",
          background: '#fff',
          boxShadow:"0 2px 18px #ff6b8125",
          borderRadius:17,
          display: "flex",
          alignItems:"center"
        }}
      >
        <span
          style={{
            fontSize: "32px",
            marginRight: 18,
            display: "inline-block",
            transform: spinning ? "rotate(6turn)" : "none",
            transition: "transform 0.8s cubic-bezier(.51,1.56,.74,-0.36)",
          }}
          role="img"
          aria-label="spinning"
        >
          🦁
        </span>
        {prompt}
      </div>
      <div style={{margin:"0 0 32px", color:"var(--primary-1)"}}>
        Time left: <strong>{timer} s</strong>
      </div>
      {/* Drawing canvas */}
      <div
        style={{
          background: "#fff",
          borderRadius: 23,
          boxShadow: "0 2px 18px #6366f110",
          padding: 17,
          marginBottom: 32,
        }}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={270}
          style={{
            border: "2px solid var(--primary-1)",
            borderRadius: 17,
            touchAction: "none",
            width: 350,
            height: 270,
            cursor: "crosshair",
            background: "#f6fff9",
          }}
          onMouseDown={onCanvasPointerDown}
          onTouchStart={onCanvasPointerDown}
        />
        <div style={{
          display:"flex",gap:9,marginTop:14,justifyContent:"center"
        }}>
          <button
            onClick={clearCanvas}
            type="button"
            style={{
              background: "var(--accent-indigo)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 16,
              fontFamily: "var(--font-head)",
              padding: "8px 19px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            disabled={submitted}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            style={{
              background: "var(--accent-green)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 16,
              fontFamily: "var(--font-head)",
              padding: "8px 24px",
              fontWeight: 700,
              cursor: "pointer",
              opacity: submitted ? 0.7 : 1.0,
            }}
            disabled={submitted}
          >
            Submit
          </button>
        </div>
        {error && (
          <div style={{
            color:"var(--accent-hot-pink)",fontFamily:"var(--font-head)", fontWeight:700,marginTop:7
          }}>{error}</div>
        )}
      </div>
    </div>
  );
}
