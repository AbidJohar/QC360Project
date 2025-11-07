import { useState } from "react";

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
    alert(" Profile updated successfully!");
  };
  return (
   <div className="profile_container">
      <h2>My Profile</h2>
      <form className="profile_form" onSubmit={handleSubmit}>
        <div className="form_group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form_group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form_group">
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            disabled
          />
        </div>

        <button type="submit" className="btn_primary">
          Update Profile
        </button>
      </form>
    </div>
  )
}
