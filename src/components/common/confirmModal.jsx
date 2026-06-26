export default function ConfirmModal({ title, message, confirmText = "Confirm", danger = true, onConfirm, onCancel, loading = false }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={() => !loading && onCancel()}
    >
      <div
        style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 340, textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: danger ? "#fff4f4" : "#f0f9eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className={`ti ${danger ? "ti-alert-triangle" : "ti-help"}`} aria-hidden="true" style={{ fontSize: 24, color: danger ? "#c0392b" : "#2d5a1b" }}></i>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: "1.25rem" }}>{message}</p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: "#fff", border: "1px solid #e0e0e0", color: "#555" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", border: "none", color: "#fff", background: danger ? "#c0392b" : "#1a3a0f", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}