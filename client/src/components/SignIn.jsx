import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {signin}  = useContext(AuthContext)

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
      await signin(formData.emailOrUsername, formData.password);
      return true;
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
      console.log("Error in signup function:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
            {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="username or email"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full py-2 "
          >
            {loading ? "login..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-2">
          Don't have an account?
          <a href="/signup" className="text-blue-600 hover:underline ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
