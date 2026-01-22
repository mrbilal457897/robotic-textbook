import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Layout from "@theme/Layout";

// This page is client-only and should not be pre-rendered
export const metadata = { hydrate: false };

export default function OAuthCallback() {
  // Use window.history for client-side navigation
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract code and state from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const errorParam = urlParams.get("error");

        if (errorParam) {
          throw new Error(
            `OAuth error: ${errorParam} - ${urlParams.get("error_description")}`
          );
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code for token and user profile
        await login(code);

        // Redirect to homepage on success
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [login]);

  return (
    <Layout title="GitHub Authentication" description="Processing authentication">
      <div
        style={{
          maxWidth: "600px",
          margin: "4rem auto",
          padding: "2rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1a2230 0%, #0a0e14 100%)",
          borderRadius: "12px",
          border: "1px solid rgba(0, 240, 255, 0.2)",
        }}
      >
        {isProcessing ? (
          <>
            <h1 style={{ color: "#00f0ff", marginBottom: "1rem" }}>
              Authenticating...
            </h1>
            <p style={{ color: "#b8c4ce" }}>
              Please wait while we complete your GitHub authentication.
            </p>
            <div
              style={{
                marginTop: "2rem",
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid rgba(0, 240, 255, 0.1)",
                borderTop: "4px solid #00f0ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </>
        ) : error ? (
          <>
            <h1 style={{ color: "#ff6b35", marginBottom: "1rem" }}>
              Authentication Failed
            </h1>
            <p style={{ color: "#b8c4ce", marginBottom: "2rem" }}>{error}</p>
            <button
              onClick={() => window.location.href = "/"}
              style={{
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #00f0ff 0%, #00c4d9 100%)",
                color: "#0a0e14",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Return to Homepage
            </button>
          </>
        ) : (
          <>
            <h1 style={{ color: "#00f0ff", marginBottom: "1rem" }}>
              Success!
            </h1>
            <p style={{ color: "#b8c4ce" }}>
              Redirecting you to the homepage...
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}
