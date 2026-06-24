import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvitationByToken, respondToInvitation } from "../../src/services/invitationService";

export default function InvitePage() {
  const { token } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getInvitationByToken(token);
        setInvitation(data);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired invitation");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handleResponse = async (resp) => {
    setSubmitting(true);
    try {
      await respondToInvitation(token, resp);
      setResponse(resp);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = ((+h % 12) || 12);
    const ampm = +h >= 12 ? "PM" : "AM";
    return `${hour}:${m} ${ampm}`;
  };

  if (loading) return (
    <div style={centerStyle}>
      <p style={{ fontSize: 14, color: "#888" }}>Loading invitation...</p>
    </div>
  );

  if (error) return (
    <div style={centerStyle}>
      <div style={{ textAlign: "center", maxWidth: 320 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff4f4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className="ti ti-link-off" aria-hidden="true" style={{ fontSize: 24, color: "#c0392b" }}></i>
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 500, color: "#111", marginBottom: 6 }}>Invalid invitation</h2>
        <p style={{ fontSize: 13, color: "#888" }}>{error}</p>
      </div>
    </div>
  );

  if (response) return (
    <div style={centerStyle}>
      <div style={{ textAlign: "center", maxWidth: 320 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: response === "accepted" ? "#f0f9eb" : "#fff4f4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className={`ti ${response === "accepted" ? "ti-check" : "ti-x"}`} aria-hidden="true" style={{ fontSize: 28, color: response === "accepted" ? "#2d5a1b" : "#c0392b" }}></i>
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 500, color: "#111", marginBottom: 6 }}>
          {response === "accepted" ? "You're going! 🎉" : "Maybe next time"}
        </h2>
        <p style={{ fontSize: 13, color: "#888" }}>
          {response === "accepted"
            ? "Your invitation has been accepted. Your digital ticket will be sent to you shortly."
            : "You have declined the invitation. Thank you for letting us know."}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a3a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="#d4a017" strokeWidth="1.2"/>
            <circle cx="10" cy="10" r="1.5" fill="#d4a017"/>
          </svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Eventify</span>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>

        {/* Flyer */}
        <div style={{
          height: 200, backgroundImage: `url(${import.meta.env.VITE_API_URL}/uploads/${invitation.flyer})`,
          backgroundSize: "cover", backgroundPosition: "center"
        }} />

        <div style={{ padding: "1.5rem" }}>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>You're invited to</p>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: "#111", marginBottom: "1rem" }}>{invitation.event_name}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
              <i className="ti ti-calendar" aria-hidden="true" style={{ color: "#1a3a0f" }}></i>
              {formatDate(invitation.date)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
              <i className="ti ti-clock" aria-hidden="true" style={{ color: "#1a3a0f" }}></i>
              {formatTime(invitation.time)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
              <i className="ti ti-map-pin" aria-hidden="true" style={{ color: "#1a3a0f" }}></i>
              {invitation.venue}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#888", marginBottom: "1.25rem", textAlign: "center" }}>
            Will you be attending?
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => handleResponse("declined")}
              disabled={submitting}
              style={{ flex: 1, height: 44, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", background: "#fff", border: "1px solid #e0e0e0", color: "#555" }}
            >
              Decline
            </button>
            <button
              onClick={() => handleResponse("accepted")}
              disabled={submitting}
              style={{ flex: 1, height: 44, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", background: "#1a3a0f", border: "none", color: "#fff" }}
            >
              {submitting ? "..." : "Accept"}
            </button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#bbb", marginTop: "1.5rem" }}>Powered by Eventify</p>
    </div>
  );
}

const centerStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "2rem" };