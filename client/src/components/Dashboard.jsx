import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let name;
    if (user) {
      name = user.username || user.email;
    } else {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const u = JSON.parse(saved);
          name = u?.username || u?.email;
        } catch (e) {
          name = null;
        }
      }
    }

    setDisplayName(name || "User");
  }, [user]);
  return (
    <>
      <div className="navbar_container">
        <div className="navbar_logo">QC360</div>

        <div className="nav_bar_links">
          <Link to="/profile" className="dashboard_button">
            Profile
          </Link>

          <Link to="/changePassword" className="dashboard_button">
            Change Password
          </Link>
        </div>

        <button onClick={handleLogout} className="logout_btn">
          Logout
        </button>
      </div>
      <div className="dashboard_container">
        <div className="dashboard_box">
          <div className="dashboard_title">Welcome, {displayName}</div>

          <p className="dashboard_subtext">
            Manage your profile, change your password, or head back home.
          </p>

          <div className="dashboard_links">
            <Link to="/" className="dashboard_button dashboard_home">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
