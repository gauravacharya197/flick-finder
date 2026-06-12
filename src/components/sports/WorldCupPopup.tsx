"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "wc_popup_dismissed";

export default function WorldCupPopup() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it doesn't flash on instant loads
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleClick = () => {
    dismiss();
    router.push("/sports");
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="New feature announcement"
      className="wc-popup"
    >
      {/* Trophy pulse */}
      <span className="wc-icon" aria-hidden="true">🏆</span>

      <div className="wc-body">
        <p className="wc-label">NEW</p>
        <p className="wc-title">Watch FIFA World Cup</p>
        <p className="wc-sub">Live scores, highlights & more</p>
      </div>

      <button className="wc-cta" onClick={handleClick}>
        Watch →
      </button>

      <button className="wc-close" onClick={dismiss} aria-label="Dismiss">
        ✕
      </button>

      <style>{`
        .wc-popup {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px 12px 12px;
          background: #111827;
          border: 1px solid rgba(250, 204, 21, 0.35);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(250,204,21,0.08);
          max-width: 300px;
          animation: wc-slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes wc-slide-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .wc-icon {
          font-size: 26px;
          flex-shrink: 0;
          animation: wc-pulse 2s ease-in-out infinite;
        }

        @keyframes wc-pulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.12); }
        }

        .wc-body {
          flex: 1;
          min-width: 0;
        }

        .wc-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #facc15;
          margin: 0 0 2px;
          text-transform: uppercase;
        }

        .wc-title {
          font-size: 13px;
          font-weight: 700;
          color: #f9fafb;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wc-sub {
          font-size: 11px;
          color: #9ca3af;
          margin: 0;
        }

        .wc-cta {
          flex-shrink: 0;
          padding: 6px 12px;
          background: #facc15;
          color: #111827;
          font-size: 12px;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .wc-cta:hover  { background: #fde047; transform: scale(1.04); }
        .wc-cta:active { transform: scale(0.97); }

        .wc-close {
          position: absolute;
          top: 6px;
          right: 7px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 10px;
          cursor: pointer;
          padding: 2px 4px;
          line-height: 1;
          transition: color 0.15s;
        }

        .wc-close:hover { color: #d1d5db; }

        @media (max-width: 480px) {
          .wc-popup {
            bottom: 16px;
            right: 16px;
            left: 16px;
            max-width: unset;
          }
        }
      `}</style>
    </div>
  );
}