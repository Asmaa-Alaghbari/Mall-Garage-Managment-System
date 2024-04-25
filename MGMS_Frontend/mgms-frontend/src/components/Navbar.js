import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCurrentUser, confirmLogout } from "./Utils";
import "./Navbar.css";
import {
  FaCalendarAlt, // Calendar icon
  FaParking, // Parking icon
  FaDollarSign, // Dollar icon
  FaUser, // User icon
  FaComments, // Comments icon
  FaSignOutAlt, // Sign out icon
  FaBars, // Hamburger icon
  FaUsersCog, // Users icon
  FaCog, // Setting icon
  FaHome, // Home icon
} from "react-icons/fa"; // Importing icons

// Navigation bar component
export default function Navbar({ setIsLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false); // Manage the mobile menu
  const [userRole, setUserRole] = useState(""); // Store the user role
  const navbarRef = useRef(null); // Reference to the navbar element
  const [, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const navigate = useNavigate();

  // Handle the click outside the navbar to close the mobile menu
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Handle click on the MGMS text
  const handleHomeClick = () => {
    navigate("/home"); // Navigate to the home page
    setIsOpen(false); // Close the navbar
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Fetch the current user data from the backend and set the user role
    fetchCurrentUser(setUserRole, setIsLoading, setError, setUserRole);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleHomeClick}>
          MGMS
        </Link>
        <FaBars className="burger-icon" onClick={() => setIsOpen(!isOpen)} />

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <NavItem
            to="/home"
            label="Home"
            icon={<FaHome className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
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
          {userRole === "ADMIN" && (
            <NavItem
              to="/users"
              label="Users"
              icon={<FaUsersCog className="nav-icon" />}
              closeNavbar={() => setIsOpen(false)}
            />
          )}
          <NavItem
            to="/settings"
            label="Settings"
            icon={<FaCog className="nav-icon" />}
            closeNavbar={() => setIsOpen(false)}
          />
          <li
            className="nav-item"
            onClick={() => confirmLogout({ setIsLoggedIn, navigate })}
          >
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
