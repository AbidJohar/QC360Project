
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCog, FaClipboardList, FaShieldAlt, FaFileAlt, FaBars } from 'react-icons/fa';


export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Admin Panel</h3>
        <button
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Open sidebar'}
          title={isOpen ? 'Collapse' : 'Open'}
        >
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="menu-section">
          <p className="menu-title" onClick={() => toggleSection('user')}>User Management</p>
           {openSection === 'user' && (
            <div className="submenu">
              <NavLink to="/admin/dashboard" className="menu-item">
                <FaClipboardList /> Dashboard
              </NavLink>
              <NavLink to="/admin/manage-users" className="menu-item">
                <FaClipboardList /> Manage Users
              </NavLink>
            </div>
          )}
        </div>

        <div className="menu-section">
          <p className="menu-title" onClick={() => toggleSection('compliance')}>Compliance</p>
          {openSection === 'compliance' && (
          <NavLink to="/admin/incidents" className="menu-item">
            <FaShieldAlt /> Incidents
          </NavLink>
          )}
        </div>

        <div className="menu-section">
          <p className="menu-title" onClick={() => toggleSection('documents')}>Documents</p>
          {openSection === 'documents' && (

          <NavLink to="/admin/docs" className="menu-item">
            <FaFileAlt /> ISO 27001
          </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}
