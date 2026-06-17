import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import PrivateRoute from "../src/routes/PrivateRoute";
import OrganizerDashboard from "../src/pages/dashboard/OrganizerDashboard";
import ReceptionistDashboard from "../src/pages/dashboard/ReceptionistDashboard";
import NewEvent from "../pages/Events/NewEvent";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/scan"
          element={
            <PrivateRoute allowedRoles={["receptionist"]}>
              <ReceptionistDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <NewEvent />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
