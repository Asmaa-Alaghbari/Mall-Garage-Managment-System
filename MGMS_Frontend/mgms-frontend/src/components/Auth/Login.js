import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForms.css";

// Handle user authentication
export default function Login({ setIsLoggedIn }) {
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // Login data (username and password)
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission requests
  const [errorMessage, setErrorMessage] = useState(""); // Error state for form submission errors
  const navigate = useNavigate(); // Redirect the user to the home page after successful login

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading
    setErrorMessage(""); // Reset previous errors

    // Prepare the request options for the POST request to the API server (backend)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
      credentials: "include", // Include cookies for authentication
    };

    const apiURL = "http://localhost:5296/api/auth/Login"; // API URL for user login

    try {
      const response = await fetch(apiURL, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed!");
      } else {
        const responseData = await response.json();
        const token = responseData.token; // Assuming the token is in the response
        localStorage.setItem("token", token); // Store token securely
        setIsLoggedIn(true); // Update the state to indicate the user is logged in
        navigate("/home"); // Redirect to home page on successful login
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "User not found! Please check your username, email or password!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Login</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
