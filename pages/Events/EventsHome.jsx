import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../src/components/layouts/DashboardLayout";
import { getEvents } from "../../src/services/eventService";

export default function EventsHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | upcoming | past
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatus = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today ? "upcoming" : "past";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  const filteredEvents = events
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => filter === "all" || getStatus(e.date) === filter);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", height: 3, width: 32, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
          <span style={{ flex: 1, background: "#d4a017" }} />
          <span style={{ flex: 1, background: "#1a3a0f" }} />
          <span style={{ flex: 1, background: "#8b3a1a" }} />
        </div>
        <h1 style={{ fontSize: 19, fontWeight: 500, color: "#111" }}>Events</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>All events you've created</p>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <i className="ti ti-search" aria-hidden="true" style={{
            position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
            fontSize: 15, color: "#bbb"
          }}></i>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", height: 38, paddingLeft: 34, paddingRight: 12,
              border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13.5,
              background: "#fff", outline: "none", fontFamily: "sans-serif"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 12.5, padding: "8px 14px", borderRadius: 8,
                border: "0.5px solid #e0e0e0", cursor: "pointer",
                background: filter === f ? "#1a3a0f" : "#fff",
                color: filter === f ? "#fff" : "#666",
                borderColor: filter === f ? "#1a3a0f" : "#e0e0e0",
                textTransform: "capitalize"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ background: "#fff4f4", border: "1px solid #fcd4d4", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#c0392b", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ fontSize: 13, color: "#888" }}>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p style={{ fontSize: 13, color: "#888" }}>No events found.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14
        }}>
          {filteredEvents.map((event) => {
            const status = getStatus(event.date);
            return (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{
                  borderRadius: 12, overflow: "hidden", height: 220,
                  position: "relative", cursor: "pointer",
                  border: "0.5px solid #e5e5e5",
                  backgroundImage: `url(${import.meta.env.VITE_API_URL}/uploads/${event.flyer})`,
                  backgroundSize: "cover", backgroundPosition: "center"
                }}
              >
                {/* Gradient overlay - top half */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "55%",
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)"
                }} />

                {/* Bottom details panel */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "#fff", padding: "10px 12px"
                }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 500, color: "#111",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    marginBottom: 5
                  }}>
                    {event.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11.5, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-calendar" aria-hidden="true"></i> {formatDate(event.date)}
                    </span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 500, padding: "3px 9px", borderRadius: 20,
                      display: "flex", alignItems: "center", gap: 4,
                      background: status === "upcoming" ? "#eef5e8" : "#fdecec",
                      color: status === "upcoming" ? "#2d5a1b" : "#c0392b"
                    }}>
                      <i className="ti ti-circle-filled" aria-hidden="true" style={{ fontSize: 6 }}></i>
                      {status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}