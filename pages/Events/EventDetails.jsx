import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../../src/services/eventService";
import { generateInvitationLink, getEventInvitations } from "../../src/services/invitationService";
import EditEventModal from "../../components/events/EditEventModal";
import AttendanceList from "../../components/events/AttendanceList";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Event
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invitations / attendance
  const [invitations, setInvitations] = useState([]);

  // Modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Invite modal
  const [inviteModal, setInviteModal] = useState(false);
  const [contactType, setContactType] = useState("email");
  const [recipientName, setRecipientName] = useState("");
  const [recipientContact, setRecipientContact] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generating, setGenerating] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Fetch event
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Fetch invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getEventInvitations(id);
        setInvitations(data);
      } catch (err) {
        console.error("Failed to load invitations");
      }
    };
    if (id) fetchInvitations();
  }, [id]);

  const handleInvitationUpdate = (invId, changes) => {
    if (changes === null) {
      setInvitations((prev) => prev.filter((i) => i.id !== invId));
    } else {
      setInvitations((prev) =>
        prev.map((i) => (i.id === invId ? { ...i, ...changes } : i))
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDeleteEvent = async () => {
    setDeleting(true);
    try {
      await deleteEvent(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
      setDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleGenerate = async () => {
    setInviteError("");
    if (!recipientName.trim()) { setInviteError("Recipient name is required"); return; }
    if (!recipientContact.trim()) { setInviteError("Contact is required"); return; }
    setGenerating(true);
    try {
      const { link } = await generateInvitationLink({
        event_id: event.id,
        recipient_name: recipientName,
        recipient_contact: recipientContact,
        contact_type: contactType,
      });
      setGeneratedLink(link);
    } catch (err) {
      setInviteError(err.response?.data?.message || "Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSentSuccess(true); }, 1000);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = +h % 12 || 12;
    const ampm = +h >= 12 ? "PM" : "AM";
    return `${hour}:${m} ${ampm}`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 14, fontFamily: "sans-serif" }}>
      Loading event...
    </div>
  );

  if (error && !event) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0392b", fontSize: 14, fontFamily: "sans-serif" }}>
      {error}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "sans-serif" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: 60, background: "#fff", borderBottom: "0.5px solid #e5e5e5" }}>
        <div onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a3a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="#d4a017" strokeWidth="1.2" />
              <circle cx="10" cy="10" r="1.5" fill="#d4a017" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Eventify</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#666" }}>{user?.name}</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a3a0f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500 }}>
            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{ fontSize: 12.5, padding: "5px 10px", borderRadius: 7, border: "0.5px solid #e5e5e5", background: "none", color: "#888", cursor: "pointer" }}>
            <i className="ti ti-logout" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>

        {/* LEFT */}
        <div style={{ width: "100%", maxWidth: 380, padding: "1.75rem" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", height: 340, backgroundImage: `url(${import.meta.env.VITE_API_URL}/uploads/${event.flyer})`, backgroundSize: "cover", backgroundPosition: "center", border: "0.5px solid #e5e5e5" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "1rem" }}>
            <button
              onClick={() => { setInviteModal(true); setGeneratedLink(""); setInviteError(""); setSentSuccess(false); setRecipientName(""); setRecipientContact(""); }}
              style={{ ...btnStyle, background: "#1a3a0f", borderColor: "#1a3a0f", color: "#fff" }}
            >
              <i className="ti ti-link" aria-hidden="true"></i> Generate invitation link
            </button>
            <button style={btnStyle}>
              <i className="ti ti-send" aria-hidden="true"></i> Send invitations
            </button>
            <button style={btnStyle}>
              <i className="ti ti-tickets" aria-hidden="true"></i> Auto-generate tickets
            </button>
            <button onClick={() => setEditModal(true)} style={btnStyle}>
              <i className="ti ti-edit" aria-hidden="true"></i> Edit event
            </button>
            <button onClick={() => setDeleteModal(true)} style={{ ...btnStyle, color: "#c0392b" }}>
              <i className="ti ti-trash" aria-hidden="true"></i> Delete event
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, minWidth: 320, padding: "1.75rem", borderLeft: "0.5px solid #e5e5e5" }}>
          <div style={{ display: "flex", height: 3, width: 32, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
            <span style={{ flex: 1, background: "#d4a017" }} />
            <span style={{ flex: 1, background: "#1a3a0f" }} />
            <span style={{ flex: 1, background: "#8b3a1a" }} />
          </div>
          <h1 style={{ fontSize: 19, fontWeight: 500, color: "#111", marginBottom: 3 }}>{event.name}</h1>
          <p style={{ fontSize: 13, color: "#888", marginBottom: "1.25rem" }}>{event.type}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
            <div style={metaItemStyle}>
              <div style={metaLabelStyle}><i className="ti ti-calendar" aria-hidden="true"></i> Date</div>
              <div style={metaValueStyle}>{formatDate(event.date)}</div>
            </div>
            <div style={metaItemStyle}>
              <div style={metaLabelStyle}><i className="ti ti-clock" aria-hidden="true"></i> Time</div>
              <div style={metaValueStyle}>{formatTime(event.time)}</div>
            </div>
            <div style={{ ...metaItemStyle, gridColumn: "1 / -1" }}>
              <div style={metaLabelStyle}><i className="ti ti-map-pin" aria-hidden="true"></i> Venue</div>
              <div style={metaValueStyle}>{event.venue}</div>
            </div>
          </div>

          <div style={{ fontSize: 14.5, fontWeight: 500, color: "#111", marginBottom: 12 }}>
            Attendance list
            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 400, marginLeft: 8 }}>
              ({invitations.length} invited)
            </span>
          </div>

          <AttendanceList
            invitations={invitations}
            eventDate={event.date}
            eventTime={event.time}
            onUpdate={handleInvitationUpdate}
          />
        </div>
      </div>

      {/* ── DELETE EVENT MODAL ── */}
      {deleteModal && (
        <div style={overlayStyle} onClick={() => !deleting && setDeleteModal(false)}>
          <div style={{ ...modalBoxStyle, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff4f4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 24, color: "#c0392b" }}></i>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111", marginBottom: 6 }}>Delete this event?</h3>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              This will permanently remove {event.name} and all attendee data. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteModal(false)} disabled={deleting} style={{ flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: "#fff", border: "1px solid #e0e0e0", color: "#555" }}>
                Cancel
              </button>
              <button onClick={handleDeleteEvent} disabled={deleting} style={{ flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: deleting ? "not-allowed" : "pointer", border: "none", color: "#fff", background: "#c0392b", opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT EVENT MODAL ── */}
      {editModal && (
        <EditEventModal
          event={event}
          onClose={() => setEditModal(false)}
          onUpdated={(updatedEvent) => setEvent({ ...event, ...updatedEvent })}
        />
      )}

      {/* ── INVITE MODAL ── */}
      {inviteModal && (
        <div style={overlayStyle} onClick={() => setInviteModal(false)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", width: "100%", maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Generate invitation link</h3>
                <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Link expires after one use</p>
              </div>
              <button onClick={() => setInviteModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18 }} aria-label="Close">
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>

            {inviteError && (
              <p style={{ background: "#fff4f4", border: "1px solid #fcd4d4", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#c0392b", marginBottom: "1rem" }}>
                {inviteError}
              </p>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={modalLabelStyle}>Recipient name</label>
              <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Ama Boateng" style={modalInputStyle} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={modalLabelStyle}>Send via</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["email", "sms"].map((type) => (
                  <button key={type} onClick={() => { setContactType(type); setRecipientContact(""); }}
                    style={{ flex: 1, height: 38, borderRadius: 8, fontSize: 13, border: contactType === type ? "1.5px solid #1a3a0f" : "1px solid #e0e0e0", background: contactType === type ? "#f0f5ee" : "#fff", color: contactType === type ? "#1a3a0f" : "#666", cursor: "pointer", fontWeight: contactType === type ? 500 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <i className={`ti ${type === "email" ? "ti-mail" : "ti-device-mobile"}`} aria-hidden="true"></i>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={modalLabelStyle}>{contactType === "email" ? "Email address" : "Phone number"}</label>
              <input type={contactType === "email" ? "email" : "tel"} value={recipientContact} onChange={(e) => setRecipientContact(e.target.value)} placeholder={contactType === "email" ? "ama@example.com" : "+233 XX XXX XXXX"} style={modalInputStyle} />
            </div>

            <button onClick={handleGenerate} disabled={generating} style={{ width: "100%", height: 42, background: "#1a3a0f", color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1rem" }}>
              <i className="ti ti-link" aria-hidden="true"></i>
              {generating ? "Generating..." : "Generate link"}
            </button>

            {generatedLink && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={modalLabelStyle}>Generated link</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, height: 38, border: "1px solid #e0e0e0", borderRadius: 8, padding: "0 10px", fontSize: 12, color: "#555", background: "#fafafa", display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{generatedLink}</span>
                    </div>
                    <button onClick={handleCopy} style={{ height: 38, padding: "0 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: copied ? "#f0f5ee" : "#fff", color: copied ? "#2d5a1b" : "#666", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} aria-hidden="true"></i>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div style={{ height: "0.5px", background: "#f0f0f0", margin: "0.75rem 0" }} />

                {sentSuccess ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#2d5a1b", fontSize: 13, padding: "8px 0" }}>
                    <i className="ti ti-check" aria-hidden="true"></i> Link sent successfully
                  </div>
                ) : (
                  <button onClick={handleSend} disabled={sending} style={{ width: "100%", height: 42, background: "#fff", color: "#1a3a0f", border: "1.5px solid #1a3a0f", borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <i className={`ti ${contactType === "email" ? "ti-mail" : "ti-device-mobile"}`} aria-hidden="true"></i>
                    {sending ? "Sending..." : `Send via ${contactType}`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ──
const btnStyle = { display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "0.5px solid #e5e5e5", background: "#fff", color: "#666", cursor: "pointer", fontFamily: "sans-serif" };
const metaItemStyle = { background: "#f8f7f4", borderRadius: 8, padding: "10px 12px" };
const metaLabelStyle = { fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 5, marginBottom: 4 };
const metaValueStyle = { fontSize: 13.5, fontWeight: 500, color: "#111" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalBoxStyle = { background: "#fff", borderRadius: 14, padding: "1.5rem", width: "100%", maxWidth: 340 };
const modalLabelStyle = { display: "block", fontSize: 12.5, fontWeight: 500, color: "#444", marginBottom: 5 };
const modalInputStyle = { width: "100%", height: 38, border: "1px solid #e0e0e0", borderRadius: 8, padding: "0 12px", fontSize: 13.5, color: "#111", background: "#fff", outline: "none", fontFamily: "sans-serif" };