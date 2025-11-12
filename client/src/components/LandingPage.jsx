
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function LandingPage() {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);


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

    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-gray-200 to-gray-100 text-black/70 px-6">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user?.username || "User"}!
          </h1>
          <p className="text-lg mb-6">Email: {user?.email}</p>
        
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to QC360 Project</h1>
          <p className="text-lg mb-6 max-w-xl">
            Join us today and explore awesome features designed to make your
            experience impressive and powerful.
          </p>
        </>
      )}
    </div>
    </>
  );
};

