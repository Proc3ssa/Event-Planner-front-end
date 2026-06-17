import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../src/components/layouts/DashboardLayout";

const EVENT_TYPES = [
  "Wedding",
  "Conference",
  "Birthday",
  "Corporate dinner",
  "Concert",
  "Graduation",
  "Other",
];

export default function NewEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    time: "",
    venue: "",
  });
  const [flyer, setFlyer] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFlyer = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setFlyer(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeFlyer = () => {
    setFlyer(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!flyer) {
      setError("Please upload an event flyer");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("flyer", flyer);

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {success && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2.5rem 2rem",
              width: "100%",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            {/* Animated check circle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="#f0f9eb"
                  stroke="#e0f0d0"
                  strokeWidth="1"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="#2d5a1b"
                  strokeWidth="3"
                  strokeDasharray="176"
                  strokeDashoffset="176"
                  strokeLinecap="round"
                  style={{ animation: "drawCircle 0.7s ease forwards" }}
                />
                <polyline
                  points="22,37 32,47 52,27"
                  fill="none"
                  stroke="#2d5a1b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                  style={{ animation: "drawCheck 0.4s ease 0.6s forwards" }}
                />
              </svg>
            </div>

            <h3
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "#111",
                marginBottom: 6,
              }}
            >
              Event created successfully!
            </h3>
            <p style={{ fontSize: 13, color: "#888", marginBottom: "1.5rem" }}>
              Redirecting you to the dashboard...
            </p>

            {/* Progress bar */}
            <div
              style={{
                height: 4,
                background: "#eee",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#2d5a1b",
                  borderRadius: 4,
                  animation: "progressBar 3s linear forwards",
                }}
              />
            </div>
          </div>

          <style>{`
      @keyframes drawCircle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes drawCheck {
        to { stroke-dashoffset: 0; }
      }
      @keyframes progressBar {
        from { width: 0%; }
        to { width: 100%; }
      }
    `}</style>
        </div>
      )}
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 120px)",
          margin: "-2rem -1.5rem",
        }}
      >
        {/* Left panel */}
        <div
          style={{
            width: "38%",
            background: "#1a3a0f",
            padding: "3rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "repeating-linear-gradient(0deg,#d4a017 0,#d4a017 4px,transparent 4px,transparent 28px),repeating-linear-gradient(90deg,#d4a017 0,#d4a017 4px,transparent 4px,transparent 28px)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                height: 4,
                width: 40,
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <span style={{ flex: 1, background: "#d4a017" }} />
              <span style={{ flex: 1, background: "#fff" }} />
              <span style={{ flex: 1, background: "#8b3a1a" }} />
              <span style={{ flex: 1, background: "#d4a017" }} />
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "#fff",
                lineHeight: 1.35,
                marginBottom: 10,
              }}
            >
              Create a new
              <br />
              event.
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              Fill in the details to set up your event and get it ready for
              invitations.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
              zIndex: 1,
            }}
          >
            {[
              {
                icon: "ti-photo",
                text: "Upload a high quality flyer — it appears on every digital ticket.",
              },
              {
                icon: "ti-clock",
                text: "Set the correct time and venue so attendees have accurate details.",
              },
            ].map(({ icon, text }) => (
              <div
                key={icon}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  gap: 10,
                }}
              >
                <i
                  className={`ti ${icon}`}
                  aria-hidden="true"
                  style={{ color: "#d4a017", fontSize: 16, marginTop: 1 }}
                ></i>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "2.5rem 2rem",
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#111",
                marginBottom: 4,
              }}
            >
              Event details
            </h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: "1.5rem" }}>
              All fields are required
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

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {/* Event name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Event name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Annual Tech Summit 2025"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Event type */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Event type</label>
                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="e.g. Wedding, Conference, Birthday..."
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Date */}
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Time */}
                <div>
                  <label style={labelStyle}>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Venue */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Venue</label>
                  <input
                    name="venue"
                    value={form.venue}
                    onChange={handleChange}
                    placeholder="e.g. Kempinski Hotel, Accra"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Flyer upload */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Event flyer</label>

                  {!preview ? (
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        border: "1.5px dashed #d5e8cc",
                        borderRadius: 10,
                        background: "#f8fdf5",
                        padding: "1.5rem",
                        cursor: "pointer",
                        minHeight: 120,
                      }}
                    >
                      <i
                        className="ti ti-cloud-upload"
                        aria-hidden="true"
                        style={{ fontSize: 30, color: "#b5d4a0" }}
                      ></i>
                      <p style={{ fontSize: 13, color: "#888" }}>
                        Click to upload flyer
                      </p>
                      <span style={{ fontSize: 12, color: "#bbb" }}>
                        PNG, JPG or WEBP — max 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFlyer}
                        style={{ display: "none" }}
                      />
                    </label>
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 10,
                        overflow: "hidden",
                        height: 160,
                      }}
                    >
                      <img
                        src={preview}
                        alt="Flyer preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeFlyer}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "rgba(0,0,0,0.55)",
                          border: "none",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Remove image"
                      >
                        <i className="ti ti-x" aria-hidden="true"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 44,
                  background: "#1a3a0f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <i className="ti ti-calendar-plus" aria-hidden="true"></i>
                {loading ? "Creating event..." : "Create event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 500,
  color: "#444",
  marginBottom: 5,
};
const inputStyle = {
  width: "100%",
  height: 40,
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 13.5,
  color: "#111",
  background: "#fff",
  outline: "none",
  fontFamily: "sans-serif",
};
