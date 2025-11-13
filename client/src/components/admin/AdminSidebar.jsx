import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserCog,
  FaClipboardList,
  FaShieldAlt,
  FaFileAlt,
} from "react-icons/fa";

export default function AdminSidebar({ isOpen: initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [openSection, setOpenSection] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const handleToggle = () => {
      if (isMobile) {
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // Auto close sidebar on mobile
      if (width < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Admin Panel</h3>
        </div>

        <nav className="sidebar-nav">
          <div className="menu-section">
            <p className="menu-title" onClick={() => toggleSection("user")}>
              User Management
            </p>
            {openSection === "user" && (
              <div className="submenu">
                <NavLink
                  to="/admin/dashboard"
                  className="menu-item"
                  onClick={handleNavClick}
                >
                  <FaClipboardList /> Dashboard
                </NavLink>
                <NavLink
                  to="/admin/viewRequests"
                  className="menu-item"
                  onClick={handleNavClick}
                >
                  <FaClipboardList /> Manage Users
                </NavLink>
              </div>
            )}
          </div>

          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("compliance")}
            >
              Compliance
            </p>
            {openSection === "compliance" && (
              <NavLink
                to="/admin/incidents"
                className="menu-item"
                onClick={handleNavClick}
              >
                <FaShieldAlt /> Incidents
              </NavLink>
            )}
          </div>

          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("documents")}
            >
              Documents
            </p>
            {openSection === "documents" && (
              <NavLink
                to="/admin/docs"
                className="menu-item"
                onClick={handleNavClick}
              >
                <FaFileAlt /> ISO 27001
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
