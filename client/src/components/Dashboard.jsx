
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <div className="navbar_container">
      <div className="navbar_logo">
       QC360
      </div>
     <button
            onClick={handleLogout}
            className="logout_btn"
          >
            Logout
          </button>
      </div>
    <div className="dashboard_container">
      <div className="dashboard_box">
        <h2 className="dashboard_title">Welcome to the Dashboard 🎉</h2>

        <p className="dashboard_subtext">
          Manage your profile, change your password, or head back home.
        </p>

        <div className="dashboard_links">
          <Link to="/" className="dashboard_button dashboard_home">
            🏠 Back to Home
          </Link>

          <Link to="/profile" className="dashboard_button dashboard_profile">
            👤 Profile
          </Link>

          <Link
            to="/changePassword"
            className="dashboard_button dashboard_change_password"
          >
            🔑 Change Password
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
