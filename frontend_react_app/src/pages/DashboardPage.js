import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FabButton from "../components/FabButton";
import { AuthContext } from "../App";
import DrawingCard from "../components/DrawingCard";
import { fetchDashboardData } from "../services/backend";
import LoadingSpinner from "../components/LoadingSpinner";

// PUBLIC_INTERFACE
export default function DashboardPage() {
  const { doLogout, user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data (drawings, featured, etc.)
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const dbData = await fetchDashboardData();
      if (!mounted) return;
      setFeatured(dbData.featured);
      setDrawings(dbData.grid);
      setLoading(false);
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  // Floating button lets you create a new drawing; navigates to drawing flow
  return (
    <div
      className="app-body"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background-gradient)",
        paddingBottom: 100,
      }}
    >
      {/* Sticky header for logo and logout */}
      <header
        style={{
          width: "100%",
          padding: "18px 0 8px",
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 2px 4px 0 rgba(60,60,70,0.05)",
          zIndex: 11,
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="app-heading"
          style={{
            fontFamily: "var(--font-alt-title)",
            fontSize: 32,
            marginLeft: 32,
            color: "var(--primary-1)",
            cursor: "pointer"
          }}
          onClick={() => window.location.reload()}
        >
          <span role="img" aria-label="fox" style={{marginRight:6}}>🦊</span>
          DoodleFinder
        </span>
        <button
          style={{
            fontWeight: 600,
            fontFamily: "var(--font-head)",
            padding: "10px 24px",
            marginRight: 30,
            borderRadius: 24,
            border: "none",
            background: "var(--primary-1)",
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: 17,
          }}
          onClick={doLogout}
        >
          Logout
        </button>
      </header>
      {/* Featured drawing card */}
      {featured && (
        <div
          style={{
            margin: '38px auto 17px',
            maxWidth: 410,
            width: '94vw',
            transition: "box-shadow 0.4s",
            borderRadius: "23px",
            background:"#fff",
            boxShadow:"0 8px 24px 0 #4444440c"
          }}
        >
          <div
            style={{
              padding:"17px 0 0 0",
              textAlign:"center",
            }}>
            <span
              style={{
                padding: "3px 18px",
                background: "linear-gradient(90deg,#fbbf24,#4e73df)",
                color: "#fff",
                borderRadius: "23px 23px 23px 4px",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: ".02em",
                position:"absolute",
                left:18,
                marginTop:-16,
                zIndex:2,
                fontFamily:"var(--font-head)",
                boxShadow:"0 2px 8px #fbbf2422"
              }}
            >
              🥇 Featured Drawing
            </span>
            <DrawingCard drawing={featured} featured />
          </div>
        </div>
      )}
      {/* Main drawing grid */}
      <main
        style={{
          width: "94vw",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "26px",
        }}
      >
        {drawings.length === 0 ? (
          <div
            style={{
              color: "var(--primary-1)",
              fontSize: 20,
              fontFamily: "var(--font-head)",
              marginTop: 54,
              gridColumn: "1/-1",
              textAlign: "center",
            }}
          >
            No drawings yet! Be the first to add one.
          </div>
        ) : (
          drawings.map((drawing) => (
            <DrawingCard key={drawing.id} drawing={drawing} />
          ))
        )}
      </main>
      {/* Add Drawing Floating Action Button */}
      <FabButton
        icon={<span role="img" aria-label="paint">🎨</span>}
        label="Add Drawing"
        style={{}}
        onClick={() => navigate("/drawing")}
      />
    </div>
  );
}
