import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const toggleMobile = () => setMobileOpen((open) => !open);
  const closeMobile = () => setMobileOpen(false);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="navbar_container">
      <div className="navbar_logo">QC360</div>

      <div className="navbar_links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <button
        className="navbar_toggle"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={toggleMobile}
      >
        {mobileOpen ? (
          "✕"
        ) : (
          <span className="hamburger">
            <span />
            <span />
            <span />
          </span>
        )}
      </button>

      {isAuthenticated ? (
        <>
          <div className="nav_button_container">
            <Link to="/dashboard" className="signin_btn">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="logout_btn">
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="navbar_buttons">
          <Link to="/login" className="signin_btn">
            Login
          </Link>
          <Link to="/signUp" className="signup_btn">
            Sign Up
          </Link>
        </div>
      )}

      {mobileOpen && (
        <div className="mobile_menu" role="menu">
          <nav className="mobile_links">
            <Link to="/" onClick={closeMobile}>
              Home
            </Link>
            <Link to="/about" onClick={closeMobile}>
              About
            </Link>
            <Link to="/services" onClick={closeMobile}>
              Services
            </Link>
            <Link to="/contact" onClick={closeMobile}>
              Contact
            </Link>
          </nav>

          <div className="mobile_actions">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="signin_btn"
                  onClick={closeMobile}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="logout_btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="signin_btn" onClick={closeMobile}>
                  Login
                </Link>
                <Link to="/signUp" className="signup_btn" onClick={closeMobile}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
