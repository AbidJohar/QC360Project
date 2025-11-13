import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css"

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Prefer context user, fallback to localStorage
    let u = user;
    if (!u) {
      try {
        u = JSON.parse(localStorage.getItem('user')) || {};
      } catch (e) {
        u = {};
      }
    }

    setFormData({
      fullName: u?.fullName || '',
      username: u?.username || '',
      email: u?.email || '',
      role: u?.role || '',
    });
  }, [user]);

  const handleChange = (e) => {
    // Only allow updating the username field here
    const { name, value } = e.target;
    if (name !== 'username') return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update only the username in localStorage (and context if needed later)
    try {
      const saved = JSON.parse(localStorage.getItem('user')) || {};
      saved.username = formData.username;
      localStorage.setItem('user', JSON.stringify(saved));
      alert("Profile updated successfully! (username updated)");
    } catch (err) {
      console.error('Failed to update user in localStorage', err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile_container">
      <div className="profile_box">
        <h2 className="profile_title">My Profile</h2>
        <p className="profile_subtitle">
          Update your account details below 
        </p>

        <form className="profile_form" onSubmit={handleSubmit}>

          <div className="form_group">
            <label className="form_label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              disabled
              placeholder="Full name"
              className="form_input disabled_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              placeholder="Email"
              className="form_input disabled_input"
            />
          </div>

          <div className="form_group">
            <label className="form_label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter a new username"
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

          <button type="submit" className="btn_primary">
            Update Username
          </button>
        </form>
      </div>
    </div>
  );
}
