import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaShieldAlt,
  FaFileAlt,
  FaBars,
} from "react-icons/fa";

export default function AdminSidebar({ isOpen: initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [openSection, setOpenSection] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", icon: <FaClipboardList />, text: "Dashboard" },
    {
      to: "/admin/viewReq",
      icon: <FaClipboardList />,
      text: "View Request",
    },
    { to: "/admin/incidents", icon: <FaShieldAlt />, text: "Incidents" },
    { to: "/admin/docs", icon: <FaFileAlt />, text: "ISO 27001" },
  ];

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

      <div
        className={`sidebar ${isOpen ? "open" : "closed"} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar collapse"
          >
            <FaBars />
          </button>
          {!isCollapsed && <h3 className="sidebar-title">Admin Panel</h3>}
        </div>

        <nav className="sidebar-nav">
          {isCollapsed ? (
            <div className="sidebar-nav-collapsed">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className="menu-item-collapsed"
                  onClick={handleNavClick}
                  aria-label={item.text}
                >
                  {isMobile ? item.icon : null}
                </NavLink>
              ))}
            </div>
          ) : (
            <>
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
                      <FaClipboardList />{" "}
                      <span className="menu-text">Dashboard</span>
                    </NavLink>
                    <NavLink
                      to="/admin/viewReq"
                      className="menu-item"
                      onClick={handleNavClick}
                    >
                      <FaClipboardList />{" "}
                      <span className="menu-text">View Request</span>
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
                    <FaShieldAlt /> <span className="menu-text">Incidents</span>
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
                    <FaFileAlt /> <span className="menu-text">ISO 27001</span>
                  </NavLink>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
