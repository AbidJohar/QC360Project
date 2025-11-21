import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useContext(AuthContext);

  const adminName = user?.fullName || user?.username || "Admin";

  // Protect admin route: only allow Admin role
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    if (user.role !== "Admin") {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <AdminSidebar isOpen={true} />
      <div className="admin-main">
        <header className="admin_header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="toggle-btn mobile-toggle"
              onClick={() => {
                const ev = new CustomEvent("toggle-sidebar");
                window.dispatchEvent(ev);
              }}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
            <div className="dashboard_header_entry">Welcome, {adminName}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
