import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../src/components/layouts/DashboardLayout";

export default function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine role from the route
  const role = location.pathname.includes("organizer") ? "organizer" : "receptionist";

  const copy = {
    organizer: {
      heading: "Add a new\norganizer.",
      desc: "They'll be able to create events, send invitations, and manage attendees.",
      badge: "Organizer account",
      icon: "ti-briefcase",
    },
    receptionist: {
      heading: "Add a new\nreceptionist.",
      desc: "They'll be able to log in and scan digital tickets at the entrance for your events.",
      badge: "Receptionist account",
      icon: "ti-id-badge",
    },
  }[role];

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {success && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem 2rem", maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
              <svg width="64" height="64" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="#f0f9eb" stroke="#e0f0d0" strokeWidth="1" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="#2d5a1b" strokeWidth="3"
                  strokeDasharray="176" strokeDashoffset="176" strokeLinecap="round"
                  style={{ animation: "drawCircle 0.7s ease forwards" }} />
                <polyline points="22,37 32,47 52,27" fill="none" stroke="#2d5a1b" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="40" strokeDashoffset="40"
                  style={{ animation: "drawCheck 0.4s ease 0.6s forwards" }} />
              </svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>
              {role === "organizer" ? "Organizer" : "Receptionist"} added successfully!
            </h3>
            <p style={{ fontSize: 13, color: "#888", marginBottom: "1.5rem" }}>Redirecting you to the dashboard...</p>
            <div style={{ height: 4, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#2d5a1b", borderRadius: 4, animation: "progressBar 2.5s linear forwards" }} />
            </div>
          </div>
          <style>{`
            @keyframes drawCircle { to { stroke-dashoffset: 0; } }
            @keyframes drawCheck { to { stroke-dashoffset: 0; } }
            @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
          `}</style>
        </div>
      )}

      <div style={{ display: "flex", minHeight: "calc(100vh - 120px)", margin: "-2rem -1.5rem" }}>

        {/* Left panel */}
        <div style={{
          width: "38%", background: "#1a3a0f", padding: "3rem 2.5rem",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "repeating-linear-gradient(0deg,#d4a017 0,#d4a017 4px,transparent 4px,transparent 28px),repeating-linear-gradient(90deg,#d4a017 0,#d4a017 4px,transparent 4px,transparent 28px)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", height: 4, width: 40, borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
              <span style={{ flex: 1, background: "#d4a017" }} />
              <span style={{ flex: 1, background: "#fff" }} />
              <span style={{ flex: 1, background: "#8b3a1a" }} />
              <span style={{ flex: 1, background: "#d4a017" }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: "#fff", lineHeight: 1.35, marginBottom: 10, whiteSpace: "pre-line" }}>
              {copy.heading}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              {copy.desc}
            </p>
          </div>

          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)",
            color: "#d4a017", fontSize: 12, padding: "5px 12px", borderRadius: 20,
            position: "relative", zIndex: 1, width: "fit-content"
          }}>
            <i className={`ti ${copy.icon}`} aria-hidden="true"></i> {copy.badge}
          </span>
        </div>

        {/* Right panel - form */}
        <div style={{ flex: 1, background: "#fff", padding: "2.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 360 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#111", marginBottom: 4 }}>Account details</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: "1.5rem" }}>Set a name, email and password for this user</p>

            {error && (
              <p style={{ background: "#fff4f4", border: "1px solid #fcd4d4", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#c0392b", marginBottom: "1rem" }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Full name</label>
                <div style={{ position: "relative" }}>
                  <i className="ti ti-user" aria-hidden="true" style={iconStyle}></i>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ama Mensah" required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email address</label>
                <div style={{ position: "relative" }}>
                  <i className="ti ti-mail" aria-hidden="true" style={iconStyle}></i>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ama@example.com" required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <i className="ti ti-lock" aria-hidden="true" style={iconStyle}></i>
                  <input
                    type={showPw ? "text" : "password"} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Create a password" required style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtnStyle}>
                    <i className={`ti ${showPw ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true"></i>
                  </button>
                </div>
                <p style={{ fontSize: 11.5, color: "#aaa", marginTop: 5 }}>Minimum 6 characters</p>
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", height: 44, background: "#1a3a0f", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                <i className="ti ti-user-plus" aria-hidden="true"></i>
                {loading ? "Adding..." : `Add ${role}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 500, color: "#444", marginBottom: 5 };
const inputStyle = {
  height: 40, border: "1px solid #e0e0e0", borderRadius: 8,
  padding: "0 12px 0 36px", fontSize: 13.5, color: "#111",
  background: "#fff", outline: "none", fontFamily: "sans-serif", width: "100%"
};
const iconStyle = { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#bbb" };
const eyeBtnStyle = { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#bbb", cursor: "pointer", fontSize: 15 };