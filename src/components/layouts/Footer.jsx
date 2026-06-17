export default function Footer() {
  return (
    <footer style={{
      background: "#fff", borderTop: "0.5px solid #e5e5e5",
      padding: "1rem 1.5rem"
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: "#1a3a0f",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="#d4a017" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="1.5" fill="#d4a017"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>Eventify</span>
          <div style={{ display: "flex", height: 3, width: 32, borderRadius: 2, overflow: "hidden", marginLeft: 6 }}>
            <span style={{ flex: 1, background: "#d4a017" }} />
            <span style={{ flex: 1, background: "#1a3a0f" }} />
            <span style={{ flex: 1, background: "#8b3a1a" }} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#aaa" }}>
          &copy; {new Date().getFullYear()} Eventify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}