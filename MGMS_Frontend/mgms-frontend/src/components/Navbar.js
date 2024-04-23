import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  FaCalendarAlt, // Calendar icon
  FaParking, // Parking icon
  FaDollarSign, // Dollar icon
  FaUser, // User icon
  FaComments, // Comments icon
  FaSignOutAlt, // Sign out icon
  FaBars, // Hamburger icon
} from "react-icons/fa"; // Importing icons

// Navigation bar component
export default function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate(); // Redirect the user to the login page after logout
  const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu
  const navbarRef = useRef(null); // Reference to the navbar element

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

  // Handle the click outside the navbar to close the mobile menu
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MGMS
        </Link>
        <FaBars className="burger-icon" onClick={() => setIsOpen(!isOpen)} />

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <NavItem
            to="/reservations"
            label="Reservations"
            icon={<FaCalendarAlt className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <NavItem
            to="/parking-spots"
            label="Parking Spots"
            icon={<FaParking className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <NavItem
            to="/payments"
            label="Payments"
            icon={<FaDollarSign className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <NavItem
            to="/profile"
            label="Profile"
            icon={<FaUser className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <NavItem
            to="/feedbacks"
            label="Feedback"
            icon={<FaComments className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <li className="nav-item" onClick={confirmLogout}>
            <FaSignOutAlt className="logout-nav-icon" />
            <span className="nav-text">Logout</span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// Navigation item component for the navigation bar menu
const NavItem = ({ to, label, icon, closeNavbar }) => {
  const handleClick = () => {
    closeNavbar(); // Close the navbar
  };

  return (
    <li className="nav-item" onClick={handleClick}>
      <Link to={to} className="nav-links">
        <span className="nav-icon-wrapper">
          {icon}
          <span className="nav-text">{label}</span>
        </span>
      </Link>
    </li>
  );
};


// I want when I hover over the icon, the text will appear slightly below the icon