import { useApp, useColors } from "../context/AppContext";

const toastConfig = {
  success: {
    border: "#E07B2A",
    icon: "💎",
  },
  warning: {
    border: "#d97706",
    icon: "⚠️",
  },
  info: {
    border: "#3b82f6",
    icon: "👥",
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  const C = useColors();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[9000] flex flex-col gap-2"
      style={{ top: 20, left: "50%", transform: "translateX(-50%)", width: "min(420px, calc(100vw - 32px))" }}
    >
      {toasts.map((toast) => {
        const cfg = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={toast.exiting ? "toast-exit" : "toast-enter"}
            style={{
              background: C.card,
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              borderLeft: `4px solid ${cfg.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              cursor: "pointer",
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{cfg.icon}</span>
            <span
              className="font-dm flex-1"
              style={{ color: C.text, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}
            >
              {toast.message}
            </span>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.muted,
                fontSize: 16,
                padding: 0,
                flexShrink: 0,
                lineHeight: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
