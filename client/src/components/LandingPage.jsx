import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-gray-200 to-gray-100 text-black/70 px-6">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user?.fullName || "User"}!
          </h1>
          <p className="text-lg mb-6">Email: {user?.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to QC360 Project</h1>
          <p className="text-lg mb-6 max-w-xl">
            Join us today and explore awesome features designed to make your
            experience impressive and powerful.
          </p>
          <Link
            to="/signup"
            className="bg-amber-500 hover:bg-amber-700 text-white font-semibold px-8 mb-3 py-3 rounded-full shadow-md transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-amber-500 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
};

export default LandingPage;
