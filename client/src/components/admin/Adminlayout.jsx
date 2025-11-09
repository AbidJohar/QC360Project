import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const adminName = user?.fullName || user?.username || 'Admin';

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h2>Welcome, {adminName}</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
