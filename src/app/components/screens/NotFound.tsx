import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F3D3D",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 52, marginBottom: 16 }}>🗺️</span>
      <h1
        style={{
          fontFamily: "Georgia, serif",
          color: "#FAF6EE",
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        404
      </h1>
      <p style={{ color: "rgba(250,246,238,0.6)", fontSize: 15, marginBottom: 28 }}>
        This path doesn't exist on the map.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#E07B2A",
          color: "#fff",
          border: "none",
          borderRadius: 99,
          padding: "12px 28px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
