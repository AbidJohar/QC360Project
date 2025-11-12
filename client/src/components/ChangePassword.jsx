import { useState } from "react";
import "../styles/profile.css"
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

  const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/user/change-password`, {
        method: "PUT",
        headers: token
          ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      setLoading(false);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = (payload && (payload.message || payload.error)) || (await res.text());
        throw new Error(msg || "Failed to change password");
      }
  const msg = (payload && payload.message) || "Password updated successfully!";
      toast.success(msg);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  return (
    <div className="profile_container">
      <div className="profile_box">
        <h2 className="profile_title">Change Password</h2>

        <form className="profile_form" onSubmit={handleSubmit}>

          <div className="form_group">
            <label className="form_label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your Current Password"
              className="form_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your New Password"
              className="form_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter Confirm Password"
              className="form_input"
            />
          </div>
          <button type="submit" className="btn_primary" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
