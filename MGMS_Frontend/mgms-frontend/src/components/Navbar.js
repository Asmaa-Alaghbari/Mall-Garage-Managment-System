import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

// Navigation bar component
export default function Navbar() {
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
          <NavItem to="/logout" label="Logout" />
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
