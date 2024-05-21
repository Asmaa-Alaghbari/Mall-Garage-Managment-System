import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess, sendFetchRequest } from "../Utils/Utils";
import "./AuthForms.css";

// Handle user authentication and login
export default function Login({ setIsLoggedIn }) {
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // Login data (username and password)
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission requests
  const [loginResponse, setLoginResponse] = useState(undefined);
  const [settings, setSettings] = useState(undefined);
  const navigate = useNavigate(); // Redirect the user to the home page after successful login

  // Update token expiration time whenever the component is mounted
  useEffect(() => {
    updateTokenExpiration(); // Update token expiration time
  }, []);

  // Handle side effects after loginResponse or settings are updated
  useEffect(() => {
    if (loginResponse && !sessionStorage.getItem("token")) {
      sessionStorage.setItem("token", loginResponse.token); // Store token securely
      sessionStorage.setItem("userId", loginResponse.userId); // Store userId
      sessionStorage.setItem("role", loginResponse.role); // Store user role, if it's part of the response

      // On successful login
      handleLoginSuccess();
      updateTokenExpiration();
    }

    if (settings) {
      applyUserSettings(settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginResponse, settings]);

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update the requestData to match the updated backend requirements
    await sendFetchRequest(
      "auth/Login",
      "POST",
      setIsLoading,
      undefined,
      setLoginResponse,
      loginData,
      true
    );
  };

  // Handle successful login
  const handleLoginSuccess = async () => {
    await loadUserSettings();
  };

  // Load user settings after successful login
  const loadUserSettings = async () => {
    const userId = sessionStorage.getItem("userId");

    await sendFetchRequest(
      `settings/GetSettingsByUserId?userId=${userId}`,
      "GET",
      setIsLoading,
      undefined,
      setSettings
    );
  };

  // Apply user settings after successful login
  const applyUserSettings = (settings) => {
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    setIsLoggedIn(true); // Update the state to indicate the user is logged in
    notifySuccess("Logged in!");
    navigate("/home"); // Redirect to home page on successful login
  };

  // Update token expiration on successful login
  const updateTokenExpiration = () => {
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + 60 * 60 * 1000; // 1 hour expiration time
    sessionStorage.setItem("tokenExpiration", expirationTime);
  };

  return (
    <div className="auth-form-container">
      <h1>Login</h1>
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
