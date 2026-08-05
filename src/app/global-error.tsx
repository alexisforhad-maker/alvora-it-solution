"use client";

import { useEffect } from "react";

/**
 * Global error boundary — only triggers if an error occurs in the root
 * layout itself (very rare). Must render its own <html>/<body> since
 * the root layout may be the thing that failed. Kept intentionally
 * plain: no fonts, no design system dependency, no navigation.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#4F8CFF", fontSize: "28px", fontWeight: 700 }}>
            Alvora IT Solution is temporarily unavailable
          </h1>
          <p style={{ color: "#5B6B77", marginTop: "12px", maxWidth: "480px" }}>
            We&apos;re working to fix this. Please try again in a moment.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "24px",
              backgroundColor: "#4F8CFF",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
