import { useState, useEffect } from "react";
import "../styles/profile.css"
import { toast } from "react-toastify";

export default function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile on mount
  const token = localStorage.getItem("accessToken");
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    setLoading(true);
    fetch(`${base}/api/user/profile`, {
      method: "GET",
      headers: token
        ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        : { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        setLoading(false);
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (payload && (payload.message || payload.error)) || (await res.text());
          throw new Error(msg || "Failed to fetch profile");
        }
        return payload;
      })
      .then((data) => {
        // server responds { success, message, data: user }
        console.log("GET /profile response:", data);
        const user = (data && data.data) || data || {};
        setFormData({
          username: user.username || "",
          email: user.email || "",
          role: user.role || "",
        });
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load profile");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/user/profile`, {
        method: "PUT",
        headers: token
          ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, email: formData.email }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = (payload && (payload.message || payload.error)) || (await res.text());
        throw new Error(msg || "Failed to update profile");
      }

      const updatedUser = (payload && payload.data) || null;
      const msg = (payload && payload.message) || "Profile updated successfully!";
      toast.success(msg);

      if (updatedUser) {
        console.log("Profile updated, response:", payload);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.warn("Failed to update localStorage user:", e);
        }
        setFormData({
          username: updatedUser.username || formData.username,
          email: updatedUser.email || formData.email,
          role: updatedUser.role || formData.role,
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile_container">
      <div className="profile_box">
        <h2 className="profile_title">My Profile</h2>
        <p className="profile_subtitle">Update your account details below 👇</p>

        <form className="profile_form" onSubmit={handleSubmit}>

          <div className="form_group">
            <label className="form_label">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="form_input disabled_input"
            />
          </div>

          <button type="submit" className="btn_primary" disabled={loading}>
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
