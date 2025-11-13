import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {

 const { isAuthenticated,  logout } = useContext(AuthContext);
const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar_container">
      <div className="navbar_logo">
       QC360
      </div>
      
      <div className="navbar_links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </div>


       {isAuthenticated ? (
        <>
        <div className='nav_button_container'>
          <Link
            to="/dashboard"
            className="signin_btn">
           Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="logout_btn"
          >
            Logout
          </button>
        </div>
        </>
      ) : (
         <div className="navbar_buttons">
        <Link to="/login" className="signin_btn">Login</Link>
        <Link to="/signUp" className="signup_btn">Sign Up</Link>
      </div>
      )}
    </div>
  );
}
