import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../src/services/authService";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [welcomeMsg, setWelcomeMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setWelcomeMsg(`Welcome back, ${data.user.name}!`);

      setTimeout(() => {
        if (data.user.role === "organizer") {
          navigate("/dashboard");
        } else if (data.user.role === "receptionist") {
          navigate("/scan");
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Left panel */}
      <div
        style={{
          width: "44%",
          background: "#1a3a0f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem 2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "rgba(212,160,23,0.2)",
              border: "1px solid rgba(212,160,23,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="7.5"
                stroke="#d4a017"
                strokeWidth="1"
              />
              <circle cx="10" cy="10" r="4" stroke="#d4a017" strokeWidth="1" />
              <circle cx="10" cy="10" r="1.5" fill="#d4a017" />
              <line
                x1="10"
                y1="2"
                x2="10"
                y2="5.5"
                stroke="#d4a017"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="14.5"
                x2="10"
                y2="18"
                stroke="#d4a017"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="10"
                x2="5.5"
                y2="10"
                stroke="#d4a017"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="14.5"
                y1="10"
                x2="18"
                y2="10"
                stroke="#d4a017"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 500 }}>
            Eventify
          </span>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              height: 5,
              width: 48,
              borderRadius: 3,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <span style={{ flex: 1, background: "#d4a017" }} />
            <span style={{ flex: 1, background: "#fff" }} />
            <span style={{ flex: 1, background: "#8b3a1a" }} />
            <span style={{ flex: 1, background: "#d4a017" }} />
            <span style={{ flex: 1, background: "#fff" }} />
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: 26,
              fontWeight: 500,
              lineHeight: 1.35,
              marginBottom: 12,
            }}
          >
            Manage events
            <br />
            with ease.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Create events, send invitations, and manage your attendees — all in
            one place.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["Organizer", "Receptionist"].map((r) => (
            <span
              key={r}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid rgba(212,160,23,0.35)",
                color: "rgba(212,160,23,0.85)",
                background: "rgba(212,160,23,0.08)",
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          padding: "2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 340 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: "2rem" }}>
            Sign in to your account to continue
          </p>

          {error && (
            <p
              style={{
                background: "#fff4f4",
                border: "1px solid #fcd4d4",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#c0392b",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          {welcomeMsg && (
            <p
              style={{
                background: "#f0f9eb",
                border: "1px solid #c2e7b0",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#2d5a1b",
                marginBottom: "1rem",
              }}
            >
              {welcomeMsg}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  height: 42,
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: "0 12px",
                  fontSize: 14,
                  background: "#fafafa",
                  outline: "none",
                  fontFamily: "sans-serif",
                }}
              />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  Password
                </label>
                <a
                  style={{ fontSize: 12, color: "#d4a017", cursor: "pointer" }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    height: 42,
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    padding: "0 36px 0 12px",
                    fontSize: 14,
                    background: "#fafafa",
                    outline: "none",
                    fontFamily: "sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#bbb",
                    fontSize: 13,
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || welcomeMsg}
              style={{
                width: "100%",
                height: 44,
                background: "#1a3a0f",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: loading || welcomeMsg ? "not-allowed" : "pointer",
                marginTop: "1.25rem",
                opacity: loading || welcomeMsg ? 0.7 : 1,
              }}
            >
              {welcomeMsg
                ? "Redirecting..."
                : loading
                  ? "Signing in..."
                  : "Sign in"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#bbb",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            Only authorized staff can access this portal
          </p>
        </div>
      </div>
    </div>
  );
}
