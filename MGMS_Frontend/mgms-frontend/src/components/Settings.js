import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmLogout, fetchCurrentUser } from "../Utils";
import "./Settings.css";

export default function Settings({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const [settings, setSettings] = useState({
    userId: "",
    darkMode: false,
    receiveNotifications: false,
  });

  // Fetch the current user data from the backend and set the settings
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log("Token from localStorage:", token);
    console.log("UserID from localStorage:", userId);

    fetchCurrentUser(setSettings, setIsLoading, setError);
  }, []);

  const updateSettings = async (settings) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const response = await fetch(
      `http://localhost:5296/api/settings/UpdateSettings?userId=${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings), // Send settings object directly
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Failed to update settings";
      throw new Error(errorMessage);
    }

    const data = await response.json().catch(() => null);

    if (!data) {
      throw new Error("Empty response received from server");
    }

    console.log("API Response:", data);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateSettings(settings); // Pass settings object
      setIsLoading(false);
      setSuccessMessage("Settings saved successfully!"); // Set success message
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(error.message || "Failed to save settings");
      setIsLoading(false);
      setSuccessMessage(""); // Clear success message
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !settings.darkMode;
    setSettings((prev) => ({ ...prev, darkMode: newDarkMode }));

    // Toggle dark mode styles
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleNotificationsToggle = () => {
    const newNotifications = !settings.receiveNotifications;
    setSettings((prev) => ({
      ...prev,
      receiveNotifications: newNotifications,
    }));
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {/* Dark Mode Toggle */}
      <div className="setting-item">
        <button onClick={handleDarkModeToggle}>
          {settings.darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Notifications Toggle */}
      <div className="setting-item">
        <button onClick={handleNotificationsToggle}>
          {settings.receiveNotifications
            ? "Disable Notifications"
            : "Enable Notifications"}
        </button>
      </div>

      {/* Save Button */}
      <div className="setting-item">
        <button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Display Success Message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* View Profile */}
      <div className="setting-item">
        <button onClick={() => navigate("/profile")}>View Profile</button>
      </div>

      {/* Log Out */}
      <div className="setting-item">
        <button
          className="logout-btn"
          onClick={() => confirmLogout({ setIsLoggedIn, navigate })}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
