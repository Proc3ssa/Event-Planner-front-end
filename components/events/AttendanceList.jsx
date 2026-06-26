import { useState, useRef, useEffect } from "react";
import { setAttendance, setTableNumber, removeInvitation } from "../../src/services/invitationService";
import ConfirmModal from "../../src/components/common/confirmModal";

export default function AttendanceList({ invitations, eventDate, eventTime, onUpdate }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tableValue, setTableValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  // Is it event day or later?
  const datePart = eventDate?.slice(0, 10);
  const timePart = eventTime?.slice(0, 5);
  const eventDateTime = new Date(`${datePart}T${timePart}:00`);
  const isEventDay = new Date() >= eventDateTime;

 const getDisplayStatus = (inv) => {
  if (isEventDay) {
    // On event day: present only if scanned, otherwise absent
    if (inv.attendance === "present") return "present";
    return "absent";
  } else {
    // Before event day: accepted or pending
    if (inv.status === "accepted") return "accepted";
    return "pending";
  }
};

 const statusConfig = {
  accepted: { label: "Accepted", bg: "#eef5e8", color: "#2d5a1b" },
  pending:  { label: "Pending",  bg: "#f2f2f2", color: "#888"    },
  present:  { label: "Present",  bg: "#eef5e8", color: "#2d5a1b" },
  absent:   { label: "Absent",   bg: "#fdecec", color: "#c0392b" },
};

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAttendanceToggle = async (inv) => {
    const next = inv.attendance === "present" ? "absent" : "present";
    try {
      await setAttendance(inv.id, next);
      onUpdate(inv.id, { attendance: next });
    } catch (err) {
      console.error(err);
    }
    setOpenMenuId(null);
  };

  const startTableEdit = (inv) => {
    setEditingId(inv.id);
    setTableValue(inv.table_number || "");
    setOpenMenuId(null);
  };

  const saveTable = async (id) => {
    try {
      await setTableNumber(id, tableValue);
      onUpdate(id, { table_number: tableValue });
    } catch (err) {
      console.error(err);
    }
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await removeInvitation(confirmDelete.id);
      onUpdate(confirmDelete.id, null);
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (invitations.length === 0) {
    return (
      <div style={{ border: "0.5px solid #e5e5e5", borderRadius: 10, padding: "2rem", textAlign: "center" }}>
        <i className="ti ti-users" aria-hidden="true" style={{ fontSize: 28, color: "#ddd", display: "block", marginBottom: 8 }}></i>
        <p style={{ fontSize: 13, color: "#aaa" }}>No invitations sent yet</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ border: "0.5px solid #e5e5e5", borderRadius: 10, minHeight: 200, maxHeight: 520, overflowY: "auto" }}>
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
            {invitations.map((inv) => {
              const status = getDisplayStatus(inv);
              const cfg = statusConfig[status];

              return (
                <tr key={inv.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, color: "#111" }}>{inv.recipient_name}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{inv.recipient_contact}</div>
                  </td>

                  <td style={tdStyle}>
                    <span style={{ fontSize: 10.5, fontWeight: 500, padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, background: cfg.bg, color: cfg.color }}>
                      <i className="ti ti-circle-filled" aria-hidden="true" style={{ fontSize: 6 }}></i>
                      {cfg.label}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {editingId === inv.id ? (
                      <input
                        autoFocus
                        value={tableValue}
                        onChange={(e) => setTableValue(e.target.value)}
                        onBlur={() => saveTable(inv.id)}
                        onKeyDown={(e) => e.key === "Enter" && saveTable(inv.id)}
                        style={{ width: 52, border: "1px solid #1a3a0f", borderRadius: 6, padding: "4px 6px", fontSize: 12.5, textAlign: "center" }}
                      />
                    ) : (
                      inv.table_number || "—"
                    )}
                  </td>

                  <td style={{ ...tdStyle, position: "relative" }}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 16, padding: 4 }}
                      aria-label="Open menu"
                    >
                      <i className="ti ti-dots" aria-hidden="true"></i>
                    </button>

                    {openMenuId === inv.id && (
                      <div ref={menuRef} style={{ position: "absolute", right: 10, top: "100%", marginTop: 4, background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 8, padding: 4, minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50 }}>

                        <div onClick={() => startTableEdit(inv)} style={menuItemStyle}>
                          <i className="ti ti-armchair" aria-hidden="true"></i> Set table
                        </div>

                        {isEventDay && (
                          <div onClick={() => handleAttendanceToggle(inv)} style={menuItemStyle}>
                            <i className={`ti ${inv.attendance === "present" ? "ti-user-x" : "ti-user-check"}`} aria-hidden="true"></i>
                            {inv.attendance === "present" ? "Mark absent" : "Mark present"}
                          </div>
                        )}

                        <div style={{ height: "0.5px", background: "#f0f0f0", margin: "4px 0" }} />

                        <div onClick={() => { setConfirmDelete(inv); setOpenMenuId(null); }} style={{ ...menuItemStyle, color: "#c0392b" }}>
                          <i className="ti ti-trash" aria-hidden="true"></i> Remove
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Remove this attendee?"
          message={`${confirmDelete.recipient_name} will be removed from the attendance list. This cannot be undone.`}
          confirmText="Remove"
          danger={true}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

const thStyle = { textAlign: "left", fontSize: 11.5, color: "#aaa", padding: "8px 10px", borderBottom: "0.5px solid #e5e5e5", fontWeight: 500 };
const tdStyle = { padding: "9px 10px", borderBottom: "0.5px solid #f0f0f0", color: "#222" };
const menuItemStyle = { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, padding: "7px 9px", borderRadius: 6, color: "#555", cursor: "pointer" };