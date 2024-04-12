import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

export default function Logout({ setIsLoggedIn }) {
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
    } else {
      // If they do not confirm, redirect them back to the home page or stay on the current page
      navigate(-1); // Navigate back to the previous page
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Logout</h1>
      <button onClick={confirmLogout}>Confirm Logout</button>
    </div>
  );
}
