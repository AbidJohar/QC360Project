import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup.css"

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signup } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!formData.role) {
        setError("Please select a role");
        setLoading(false);
        return;
      }

      await signup(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );

      // If user signed up as Admin, send to admin screen, otherwise regular dashboard
      if (formData.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign_up_container">
      <div className="sign_up_box">
        <h2 className="sign_up_title">Create an Account</h2>

        {error && <div className="error_message">{error}</div>}

        <form onSubmit={handleSubmit} className="sign_up_form">
          
          <div className="form_group">
            <label className="form_label">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="form_input"
              required
              disabled={loading}
            />
          </div>

      
          <div className="form_group">
            <label className="form_label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter a unique username"
              value={formData.username}
              onChange={handleChange}
              className="form_input"
              required
              disabled={loading}
            />
          </div>

          <div className="form_group">
            <label className="form_label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="form_input"
              required
              disabled={loading}
            />
          </div>

          <div className="form_group">
            <label className="form_label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="form_input"
              required
              disabled={loading}
            />
          </div>

          <div className="form_group">
            <label className="form_label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form_input"
              required
              disabled={loading}
            />
          </div>

          <div className="form_group">
            <label className="form_label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form_select"
              disabled={loading}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="sign_up_button"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="login_text">
          Already have an account?
          <Link to="/login" className="login_link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
