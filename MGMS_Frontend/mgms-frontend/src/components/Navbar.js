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
          <li className="nav-item">
            <Link to="/home" className="nav-links active">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reservations" className="nav-links">
              Reservations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/parking-spots" className="nav-links">
              Parking Spots
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/logout" className="nav-links">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
