import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/admin.css"

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useContext(AuthContext);

  const adminName = user?.fullName || user?.username || 'Admin';

  // Protect admin route: only allow Admin role
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'Admin') {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

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
