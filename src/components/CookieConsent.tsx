import { useEffect, useState } from "react";
import { initGA4 } from "@/utils/analytics";

const STORAGE_KEY = "cookie_consent";

type ConsentStatus = "accepted" | "declined" | null;

function getStoredConsent(): ConsentStatus {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === "accepted") {
      initGA4();
      return;
    }
    if (stored === null) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setExiting(true);
    setTimeout(() => setVisible(false), 300);
  }

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    initGA4();
    dismiss();
  }

  function handleDecline() {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      // ignore
    }
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        background: "rgba(23, 23, 23, 0.92)",
        color: "#fff",
        fontSize: "0.875rem",
        lineHeight: 1.5,
        backdropFilter: "blur(6px)",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: exiting ? "translateY(100%)" : "translateY(0)",
        opacity: exiting ? 0 : 1,
      }}
    >
      <p style={{ margin: 0, maxWidth: "600px" }}>
        We use cookies to analyze site traffic and improve your experience.
      </p>

      <button
        onClick={handleDecline}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.4)",
          color: "#fff",
          padding: "0.35rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.8125rem",
          whiteSpace: "nowrap",
        }}
      >
        Decline
      </button>

      <button
        onClick={handleAccept}
        style={{
          background: "#fff",
          border: "none",
          color: "#171717",
          padding: "0.35rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.8125rem",
          whiteSpace: "nowrap",
        }}
      >
        Accept
      </button>
    </div>
  );
}
