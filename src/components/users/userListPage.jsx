import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getUsersByRole, updateUserStatus } from "../../services/userService";

export default function UserListPage({ role }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const activeCount = users.filter(u => u.status === "active").length;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersByRole(role);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleConfirm = async () => {
    if (!confirmUser) return;
    setActionLoading(true);
    try {
      const newStatus = confirmUser.status === "active" ? "inactive" : "active";
      await updateUserStatus(confirmUser.id, newStatus);
      await fetchUsers();
      setConfirmUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setConfirmUser(null);
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", height: 3, width: 32, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
            <span style={{ flex: 1, background: "#d4a017" }} />
            <span style={{ flex: 1, background: "#1a3a0f" }} />
            <span style={{ flex: 1, background: "#8b3a1a" }} />
          </div>
          <h1 style={{ fontSize: 19, fontWeight: 500, color: "#111" }}>
            {role === "organizer" ? "Organizers" : "Receptionists"}
          </h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>
            {role === "organizer"
              ? "Manage organizer accounts. At least one active organizer is required."
              : "Manage receptionist accounts."}
          </p>
        </div>

        {error && (
          <p style={{ background: "#fff4f4", border: "1px solid #fcd4d4", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#c0392b", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ fontSize: 13, color: "#888" }}>Loading...</p>
        ) : users.length === 0 ? (
          <p style={{ fontSize: 13, color: "#888" }}>No {role}s found.</p>
        ) : (
          <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
            {users.map((user) => {
              const isLastActiveOrganizer = role === "organizer" && user.status === "active" && activeCount <= 1;

              return (
                <div key={user.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.85rem 1.1rem", borderBottom: "0.5px solid #eee", gap: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: user.status === "active" ? "#1a3a0f" : "#bbb",
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 500, flexShrink: 0
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#999" }}>{user.email}</div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11,
                        padding: "3px 8px", borderRadius: 20, marginTop: 4,
                        background: user.status === "active" ? "#eef5e8" : "#f5f5f5",
                        color: user.status === "active" ? "#2d5a1b" : "#999"
                      }}>
                        <i className="ti ti-circle-filled" aria-hidden="true" style={{ fontSize: 6 }}></i>
                        {user.status === "active" ? "Active" : "Deactivated"}
                      </span>
                    </div>
                  </div>

                  {isLastActiveOrganizer ? (
                    <span style={{
                      fontSize: 11, color: "#c89a3a", background: "#fdf6e8",
                      border: "0.5px solid #f0e0b8", padding: "4px 9px", borderRadius: 7,
                      whiteSpace: "nowrap"
                    }}>
                      <i className="ti ti-shield-lock" aria-hidden="true"></i> Last organizer
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmUser(user)}
                      style={{
                        display: "flex", alignItems: "center", gap: 5, fontSize: 12.5,
                        padding: "6px 11px", borderRadius: 7, cursor: "pointer", flexShrink: 0,
                        border: user.status === "active" ? "0.5px solid #f0d4d4" : "0.5px solid #d4e8d4",
                        background: user.status === "active" ? "#fff8f8" : "#f6fdf6",
                        color: user.status === "active" ? "#c0392b" : "#2d5a1b",
                      }}
                    >
                      <i className={`ti ${user.status === "active" ? "ti-user-x" : "ti-user-check"}`} aria-hidden="true"></i>
                      {user.status === "active" ? "Dismiss" : "Reactivate"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmUser && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 340, textAlign: "center" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: confirmUser.status === "active" ? "#fff4f4" : "#f0f9eb",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem"
            }}>
              <i className={`ti ${confirmUser.status === "active" ? "ti-alert-triangle" : "ti-user-check"}`} aria-hidden="true"
                style={{ fontSize: 24, color: confirmUser.status === "active" ? "#c0392b" : "#2d5a1b" }}></i>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: "#111", marginBottom: 6 }}>
              {confirmUser.status === "active" ? "Dismiss this " + role + "?" : "Reactivate this " + role + "?"}
            </h3>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              {confirmUser.status === "active"
                ? `${confirmUser.name} will no longer be able to log in. You can reactivate them later from this page.`
                : `${confirmUser.name} will be able to log in again.`}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmUser(null)} style={{
                flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500,
                cursor: "pointer", background: "#fff", border: "1px solid #e0e0e0", color: "#555"
              }}>
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={actionLoading} style={{
                flex: 1, height: 38, borderRadius: 8, fontSize: 13.5, fontWeight: 500,
                cursor: actionLoading ? "not-allowed" : "pointer", border: "none", color: "#fff",
                background: confirmUser.status === "active" ? "#c0392b" : "#2d5a1b",
                opacity: actionLoading ? 0.7 : 1
              }}>
                {actionLoading ? "..." : confirmUser.status === "active" ? "Dismiss" : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}