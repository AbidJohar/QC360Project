import  { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signIn.css"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signin, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      await signin(formData.email, formData.password);
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      console.log("Logged in user:", loggedInUser);
      console.log("User role:", loggedInUser?.role);
      if (loggedInUser && loggedInUser.role === "Admin") {
        console.log("Redirecting to admin");
        navigate("/admin");
      } else {
        console.log("Redirecting to home");
        navigate("/");
      }
      return true;
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
      console.log("Error in signup function:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="login_container">
      <div className="login_box">
        <h2 className="login_title">Welcome Back</h2>

        {error && <div className="error_message">{error}</div>}

        <form onSubmit={handleSubmit} className="login_form">
          <div className="form-group">
            <label className="form_label">Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              className="form_input"
              required
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
            />
          </div>

          <button type="submit" className="login_button">
            {loading ? "login..." : "Login"}
          </button>
        </form>

        <p className="signup_text">
          Don't have an account?
          <a href="/signup" className="signup_link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

