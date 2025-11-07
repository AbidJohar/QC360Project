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

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
      console.error("Error in signup function:", error);
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
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
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
              name="user_name"
              placeholder="Enter a unique username"
              value={formData.user_name}
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
              name="confirm_password"
              placeholder="********"
              value={formData.confirm_password}
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
