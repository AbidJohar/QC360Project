import { useState } from "react";
import "../styles/profile.css"

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    role: "Employee",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile_container">
      <div className="profile_box">
        <h2 className="profile_title">My Profile</h2>
        <p className="profile_subtitle">
          Update your account details below 👇
        </p>

        <form className="profile_form" onSubmit={handleSubmit}>
         
          <div className="form_group">
            <label className="form_label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
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

          <button type="submit" className="btn_primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
