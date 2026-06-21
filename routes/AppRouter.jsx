import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import PrivateRoute from "../src/routes/PrivateRoute";
import ReceptionistDashboard from "../src/pages/dashboard/ReceptionistDashboard";
import NewEvent from "../pages/Events/NewEvent";
import AddUser from "../pages/users/AddUser";
import OrganizersList from "../pages/users/OrganizersList";
import ReceptionistsList from "../pages/users/ReceptionistList";
import EventsHome from "../pages/Events/EventsHome";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <EventsHome />
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

        <Route
          path="/users/add-organizer"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <AddUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/add-receptionist"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <AddUser />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizers"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <OrganizersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/receptionists"
          element={
            <PrivateRoute allowedRoles={["organizer"]}>
              <ReceptionistsList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}