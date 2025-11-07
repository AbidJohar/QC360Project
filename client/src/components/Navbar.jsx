import { Link } from 'react-router-dom';


export default function Navbar() {
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
      
      <div className="navbar_buttons">
        <Link to="/login" className="signin_btn">Login</Link>
        <Link to="/signUp" className="signup_btn">Sign Up</Link>
      </div>
    </div>
  );
}
