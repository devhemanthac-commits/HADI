import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to an error-reporting service here
    console.error("[HADI] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

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
        <span style={{ fontSize: 52, marginBottom: 16 }}>🧭</span>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            color: "#FAF6EE",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: "rgba(250,246,238,0.6)",
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 320,
            marginBottom: 28,
          }}
        >
          HADI ran into an unexpected error. Try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
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
          Refresh Page
        </button>
        {this.state.error && (
          <p
            style={{
              marginTop: 20,
              color: "rgba(250,246,238,0.3)",
              fontSize: 11,
              fontFamily: "monospace",
              maxWidth: 400,
              wordBreak: "break-word",
            }}
          >
            {this.state.error.message}
          </p>
        )}
      </div>
    );
  }
}
