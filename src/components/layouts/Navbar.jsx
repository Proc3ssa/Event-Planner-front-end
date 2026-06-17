import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav style={{
        background: "#fff", borderBottom: "0.5px solid #e5e5e5",
        padding: "0 1.5rem", height: 60, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#1a3a0f",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="#d4a017" strokeWidth="1.2"/>
              <circle cx="10" cy="10" r="4" stroke="#d4a017" strokeWidth="1"/>
              <circle cx="10" cy="10" r="1.5" fill="#d4a017"/>
              <line x1="10" y1="2" x2="10" y2="5.5" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="10" y1="14.5" x2="10" y2="18" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="10" x2="5.5" y2="10" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="14.5" y1="10" x2="18" y2="10" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Eventify</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: "flex", alignItems: "center", gap: 2, listStyle: "none", margin: 0 }}
          className="desktop-nav">
          {[
            { label: "Home", path: "/dashboard", icon: "ti-home" },
            { label: "New event", path: "/events/new", icon: "ti-calendar-plus" },
          ].map(({ label, path, icon }) => (
            <li key={path}>
              <Link to={path} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13.5, padding: "6px 12px", borderRadius: 7,
                textDecoration: "none",
                background: isActive(path) ? "#f0f5ee" : "transparent",
                color: isActive(path) ? "#1a3a0f" : "#666",
                fontWeight: isActive(path) ? 500 : 400,
              }}>
                <i className={`ti ${icon}`} aria-hidden="true"></i> {label}
              </Link>
            </li>
          ))}

          {/* Add User dropdown */}
          <li style={{ position: "relative" }}
            onMouseEnter={() => setSubOpen(true)}
            onMouseLeave={() => setSubOpen(false)}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 13.5,
              padding: "6px 12px", borderRadius: 7, border: "none",
              background: "transparent", color: "#666", cursor: "pointer"
            }}>
              <i className="ti ti-user-plus" aria-hidden="true"></i> Add user
              <i className="ti ti-chevron-down" aria-hidden="true" style={{ fontSize: 12 }}></i>
            </button>
            {subOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0,
                background: "#fff", border: "0.5px solid #e5e5e5",
                borderRadius: 10, padding: 6, minWidth: 190,
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)", zIndex: 200
              }}>
                <p style={{ fontSize: 11, color: "#bbb", padding: "4px 10px 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Select user type
                </p>
                <Link to="/users/add-organizer" style={dropItemStyle}>
                  <i className="ti ti-briefcase" aria-hidden="true"></i> Add organizer
                </Link>
                <Link to="/users/add-receptionist" style={dropItemStyle}>
                  <i className="ti ti-id-badge" aria-hidden="true"></i> Add receptionist
                </Link>
              </div>
            )}
          </li>

          {[
            { label: "Organizers", path: "/organizers", icon: "ti-users" },
            { label: "Receptionists", path: "/receptionists", icon: "ti-id" },
          ].map(({ label, path, icon }) => (
            <li key={path}>
              <Link to={path} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13.5, padding: "6px 12px", borderRadius: 7,
                textDecoration: "none",
                background: isActive(path) ? "#f0f5ee" : "transparent",
                color: isActive(path) ? "#1a3a0f" : "#666",
                fontWeight: isActive(path) ? 500 : 400,
              }}>
                <i className={`ti ${icon}`} aria-hidden="true"></i> {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={handleLogout} style={{
            fontSize: 12.5, padding: "5px 10px", borderRadius: 7,
            border: "0.5px solid #e5e5e5", background: "none",
            color: "#888", cursor: "pointer"
          }}>
            <i className="ti ti-logout" aria-hidden="true"></i>
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#1a3a0f",
            color: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 12, fontWeight: 500
          }}>
            {initials}
          </div>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: "#333", display: "none"
          }} className="hamburger" aria-label="Toggle menu">
            <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"}`} aria-hidden="true"></i>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "#fff", borderBottom: "0.5px solid #e5e5e5",
          padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: 2
        }}>
          {[
            { label: "Home", path: "/dashboard", icon: "ti-home" },
            { label: "New event", path: "/events/new", icon: "ti-calendar-plus" },
          ].map(({ label, path, icon }) => (
            <Link key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{ ...mobileItemStyle, background: isActive(path) ? "#f0f5ee" : "transparent", color: isActive(path) ? "#1a3a0f" : "#555" }}>
              <i className={`ti ${icon}`} aria-hidden="true"></i> {label}
            </Link>
          ))}

          <button onClick={() => setSubOpen(!subOpen)} style={{ ...mobileItemStyle, border: "none", background: "none", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className="ti ti-user-plus" aria-hidden="true"></i> Add user
            </span>
            <i className={`ti ${subOpen ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden="true" style={{ fontSize: 13 }}></i>
          </button>
          {subOpen && (
            <div style={{ paddingLeft: "1.5rem", marginLeft: "1.5rem", borderLeft: "2px solid #e8f0e4", display: "flex", flexDirection: "column", gap: 2 }}>
              <Link to="/users/add-organizer" onClick={() => setMenuOpen(false)} style={mobileItemStyle}>
                <i className="ti ti-briefcase" aria-hidden="true"></i> Add organizer
              </Link>
              <Link to="/users/add-receptionist" onClick={() => setMenuOpen(false)} style={mobileItemStyle}>
                <i className="ti ti-id-badge" aria-hidden="true"></i> Add receptionist
              </Link>
            </div>
          )}

          {[
            { label: "Organizers", path: "/organizers", icon: "ti-users" },
            { label: "Receptionists", path: "/receptionists", icon: "ti-id" },
          ].map(({ label, path, icon }) => (
            <Link key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{ ...mobileItemStyle, background: isActive(path) ? "#f0f5ee" : "transparent", color: isActive(path) ? "#1a3a0f" : "#555" }}>
              <i className={`ti ${icon}`} aria-hidden="true"></i> {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

const dropItemStyle = {
  display: "flex", alignItems: "center", gap: 10,
  fontSize: 13.5, padding: "8px 10px", borderRadius: 7,
  color: "#555", textDecoration: "none"
};

const mobileItemStyle = {
  display: "flex", alignItems: "center", gap: 10,
  fontSize: 14, padding: "10px 12px", borderRadius: 8,
  color: "#555", textDecoration: "none", cursor: "pointer", width: "100%"
};