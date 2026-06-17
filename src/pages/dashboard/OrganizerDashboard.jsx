import DashboardLayout from "../../components/layouts/DashboardLayout";

export default function OrganizerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>
          Welcome back, {user?.name}.
        </p>
      </div>
      {/* stats and content go here */}
    </DashboardLayout>
  );
}