import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../../src/services/eventService";
import { generateInvitationLink } from "../../src/services/invitationService";

const PLACEHOLDER_ATTENDEES = [
  { id: 1, name: "Ama Boateng", status: "present", table: "4" },
  { id: 2, name: "Kwabena Owusu", status: "absent", table: "2" },
  { id: 3, name: "Efua Mensima", status: "pending", table: "" },
  { id: 4, name: "Yaw Darko", status: "pending", table: "" },
  { id: 5, name: "Abena Sarpong", status: "present", table: "1" },
  { id: 6, name: "Kofi Antwi", status: "absent", table: "3" },
  { id: 7, name: "Adwoa Frimpong", status: "pending", table: "" },
];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Event state
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Attendee state
  const [attendees, setAttendees] = useState(PLACEHOLDER_ATTENDEES);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tableValue, setTableValue] = useState("");
  const menuRef = useRef(null);

  // Modal state
  const [ticketModal, setTicketModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Invite modal state
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  const handleSend = async () => {
    // SMS/email integration later
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

  const startEdit = (attendee) => {
    setEditingId(attendee.id);
    setTableValue(attendee.table);
    setOpenMenuId(null);
  };

  const saveTable = (aid) => {
    setAttendees(attendees.map((a) => (a.id === aid ? { ...a, table: tableValue } : a)));
    setEditingId(null);
  };

  const handleDeleteAttendee = (aid) => {
    setAttendees(attendees.filter((a) => a.id !== aid));
    setOpenMenuId(null);
  };

  const statusStyle = {
    present: { background: "#eef5e8", color: "#2d5a1b" },
    absent: { background: "#fdecec", color: "#c0392b" },
    pending: { background: "#f2f2f2", color: "#888" },
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

        {/* LEFT - flyer + action buttons */}
        <div style={{ width: "100%", maxWidth: 380, padding: "1.75rem" }}>
          <div style={{
            borderRadius: 12, overflow: "hidden", height: 340,
            backgroundImage: `url(${import.meta.env.VITE_API_URL}/uploads/${event.flyer})`,
            backgroundSize: "cover", backgroundPosition: "center", border: "0.5px solid #e5e5e5"
          }} />

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
            <button onClick={() => navigate(`/events/${id}/edit`)} style={btnStyle}>
              <i className="ti ti-edit" aria-hidden="true"></i> Edit event
            </button>
            <button onClick={() => setDeleteModal(true)} style={{ ...btnStyle, color: "#c0392b" }}>
              <i className="ti ti-trash" aria-hidden="true"></i> Delete event
            </button>
          </div>
        </div>

        {/* RIGHT - event details + attendance */}
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
          </div>

          <div style={{ border: "0.5px solid #e5e5e5", borderRadius: 10, maxHeight: 360, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Table</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id}>
                    <td style={tdStyle}>{a.name}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 10.5, fontWeight: 500, padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, ...statusStyle[a.status] }}>
                        <i className="ti ti-circle-filled" aria-hidden="true" style={{ fontSize: 6 }}></i>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {editingId === a.id ? (
                        <input
                          autoFocus
                          value={tableValue}
                          onChange={(e) => setTableValue(e.target.value)}
                          onBlur={() => saveTable(a.id)}
                          onKeyDown={(e) => e.key === "Enter" && saveTable(a.id)}
                          style={{ width: 48, border: "1px solid #1a3a0f", borderRadius: 6, padding: "4px 6px", fontSize: 12.5, textAlign: "center" }}
                        />
                      ) : (
                        a.table || "—"
                      )}
                    </td>
                    <td style={{ ...tdStyle, position: "relative" }}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === a.id ? null : a.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 16, padding: 4 }}
                        aria-label="Open menu"
                      >
                        <i className="ti ti-dots" aria-hidden="true"></i>
                      </button>
                      {openMenuId === a.id && (
                        <div ref={menuRef} style={{ position: "absolute", right: 10, top: "100%", marginTop: 4, background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 8, padding: 4, minWidth: 140, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50 }}>
                          <div onClick={() => { setTicketModal(a); setOpenMenuId(null); }} style={menuItemStyle}>
                            <i className="ti ti-ticket" aria-hidden="true"></i> View ticket
                          </div>
                          <div onClick={() => startEdit(a)} style={menuItemStyle}>
                            <i className="ti ti-edit" aria-hidden="true"></i> Set table
                          </div>
                          <div onClick={() => handleDeleteAttendee(a.id)} style={{ ...menuItemStyle, color: "#c0392b" }}>
                            <i className="ti ti-trash" aria-hidden="true"></i> Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── TICKET PREVIEW MODAL ── */}
      {ticketModal && (
        <div style={overlayStyle} onClick={() => setTicketModal(null)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Digital ticket</h3>
              <button onClick={() => setTicketModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18 }} aria-label="Close">
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>
            <div style={{ background: "#1a3a0f", borderRadius: 12, padding: "1.5rem", textAlign: "center", color: "#fff" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{event.name}</p>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>{ticketModal.name}</p>
              <div style={{ background: "#fff", borderRadius: 8, padding: 16, display: "inline-block" }}>
                <i className="ti ti-qrcode" aria-hidden="true" style={{ fontSize: 100, color: "#1a3a0f" }}></i>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 14 }}>
                {formatDate(event.date)} &bull; {formatTime(event.time)}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{event.venue}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* ── INVITE MODAL ── */}
      {inviteModal && (
        <div style={overlayStyle} onClick={() => setInviteModal(false)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", width: "100%", maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
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

            {/* Recipient name */}
            <div style={{ marginBottom: 12 }}>
              <label style={modalLabelStyle}>Recipient name</label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ama Boateng"
                style={modalInputStyle}
              />
            </div>

            {/* Contact type toggle */}
            <div style={{ marginBottom: 12 }}>
              <label style={modalLabelStyle}>Send via</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["email", "sms"].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setContactType(type); setRecipientContact(""); }}
                    style={{
                      flex: 1, height: 38, borderRadius: 8, fontSize: 13,
                      border: contactType === type ? "1.5px solid #1a3a0f" : "1px solid #e0e0e0",
                      background: contactType === type ? "#f0f5ee" : "#fff",
                      color: contactType === type ? "#1a3a0f" : "#666",
                      cursor: "pointer", fontWeight: contactType === type ? 500 : 400,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    <i className={`ti ${type === "email" ? "ti-mail" : "ti-device-mobile"}`} aria-hidden="true"></i>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={modalLabelStyle}>{contactType === "email" ? "Email address" : "Phone number"}</label>
              <input
                type={contactType === "email" ? "email" : "tel"}
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder={contactType === "email" ? "ama@example.com" : "+233 XX XXX XXXX"}
                style={modalInputStyle}
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{ width: "100%", height: 42, background: "#1a3a0f", color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1rem" }}
            >
              <i className="ti ti-link" aria-hidden="true"></i>
              {generating ? "Generating..." : "Generate link"}
            </button>

            {/* Generated link + send */}
            {generatedLink && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={modalLabelStyle}>Generated link</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, height: 38, border: "1px solid #e0e0e0", borderRadius: 8, padding: "0 10px", fontSize: 12, color: "#555", background: "#fafafa", display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {generatedLink}
                      </span>
                    </div>
                    <button
                      onClick={handleCopy}
                      style={{ height: 38, padding: "0 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: copied ? "#f0f5ee" : "#fff", color: copied ? "#2d5a1b" : "#666", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
                    >
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
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{ width: "100%", height: 42, background: "#fff", color: "#1a3a0f", border: "1.5px solid #1a3a0f", borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
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
const btnStyle = {
  display: "flex", alignItems: "center", gap: 8, fontSize: 13,
  padding: "9px 12px", borderRadius: 8, border: "0.5px solid #e5e5e5",
  background: "#fff", color: "#666", cursor: "pointer", fontFamily: "sans-serif"
};
const metaItemStyle = { background: "#f8f7f4", borderRadius: 8, padding: "10px 12px" };
const metaLabelStyle = { fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 5, marginBottom: 4 };
const metaValueStyle = { fontSize: 13.5, fontWeight: 500, color: "#111" };
const thStyle = { textAlign: "left", fontSize: 11.5, color: "#aaa", padding: "8px 10px", borderBottom: "0.5px solid #e5e5e5", fontWeight: 500 };
const tdStyle = { padding: "9px 10px", borderBottom: "0.5px solid #f0f0f0", color: "#222" };
const menuItemStyle = { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, padding: "7px 9px", borderRadius: 6, color: "#555", cursor: "pointer" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalBoxStyle = { background: "#fff", borderRadius: 14, padding: "1.5rem", width: "100%", maxWidth: 340 };
const modalLabelStyle = { display: "block", fontSize: 12.5, fontWeight: 500, color: "#444", marginBottom: 5 };
const modalInputStyle = { width: "100%", height: 38, border: "1px solid #e0e0e0", borderRadius: 8, padding: "0 12px", fontSize: 13.5, color: "#111", background: "#fff", outline: "none", fontFamily: "sans-serif" };