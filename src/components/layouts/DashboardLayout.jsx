import Navbar from "./Navbar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8f7f4" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}