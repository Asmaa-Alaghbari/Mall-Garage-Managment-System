import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Navigation bar component
export default function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate(); // Redirect the user to the login page after logout

  // Handle the actual logout process and redirect the user to the login page
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    setIsLoggedIn(false); // Update the login state to false
    navigate("/login"); // Redirect the user to the login page
  };

  // Call the confirmation dialog before performing logout
  const confirmLogout = () => {
    // Display a confirmation dialog to the user
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MGMS
        </Link>
        <ul className="nav-menu">
          <NavItem to="/home" label="Home" />
          <NavItem to="/reservations" label="Reservations" />
          <NavItem to="/parking-spots" label="Parking Spots" />
          <NavItem to="/payments" label="Payments" />
          <NavItem to="/profile" label="Profile" />
          <NavItem to="feedbacks" label="Feedback" />
          <li className="nav-item" onClick={confirmLogout}>
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
}

// Navigation item component
const NavItem = ({ to, label }) => (
  <li className="nav-item">
    <Link to={to} className="nav-links">
      {label}
    </Link>
  </li>
);
