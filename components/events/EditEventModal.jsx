import { useState } from "react";
import api from "../../src/services/api";

export default function EditEventModal({ event, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: event.name,
    type: event.type,
    date: event.date?.slice(0, 10),
    time: event.time?.slice(0, 5),
    venue: event.venue,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put(`/api/events/${event.id}`, form);
      onUpdated(data.event);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Edit event</h3>
            <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Update the event details below</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18 }} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        {error && (
          <p style={{ background: "#fff4f4", border: "1px solid #fcd4d4", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#c0392b", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Event name</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Event type</label>
              <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. Wedding, Conference..." required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Kempinski Hotel, Accra" required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: "#fff", border: "1px solid #e0e0e0", color: "#555" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, height: 42, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", border: "none", color: "#fff", background: "#1a3a0f", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 500, color: "#444", marginBottom: 5 };
const inputStyle = { width: "100%", height: 40, border: "1px solid #e0e0e0", borderRadius: 8, padding: "0 12px", fontSize: 13.5, color: "#111", background: "#fff", outline: "none", fontFamily: "sans-serif" };