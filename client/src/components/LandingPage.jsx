
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function LandingPage() {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);


  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <Navbar />

    <div className="main_page_container">
      {isAuthenticated ? (
        <>
          <h1>
            Welcome back, {user?.fullName || "User"}!
          </h1>
          <p>Email: {user?.email}</p>
        
        </>
      ) : (
        <>
        <div className="text__container">

          <div className="text__container__heading" >Welcome to QC360 Project</div>
          <div className="text__container__subheading">
            Join us today and explore awesome features designed to make your
            experience impressive and powerful.
          </div>
        </div>
        </>
      )}
    </div>
    </>
  );
};

