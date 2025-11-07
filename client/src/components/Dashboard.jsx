
import { Link } from "react-router-dom";


export default function Dashboard() {
  return (
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
  );
}
