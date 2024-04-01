import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

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
            <Link to="/home" className="nav-links">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links">Log out</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
