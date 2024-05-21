import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmLogout, notifySuccess, sendFetchRequest } from "../Utils/Utils";
import "./Settings.css";

// Settings page for the user
export default function Settings({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [successMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const [settings, setSettings] = useState({
    userId: "",
    darkMode: false,
    receiveNotifications: false,
  });

  // Fetch the current user data from the backend and set the settings
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await loadUserSettings();
    };

    fetchData();

    return () => {
      // Perform the settings fetch when the component is about to unmount
      if (isMounted) {
        saveSettingsBeforeUnmount();
      }
      isMounted = false;
    };
  }, [settings.userId]);

  // Fetch the user's settings from the backend
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

  // Save the user's settings to the backend
  const saveSettingsBeforeUnmount = async () => {
    const userId = sessionStorage.getItem("userId");

    await sendFetchRequest(
      `settings/GetSettingsByUserId?userId=${userId}`,
      "GET",
      setIsLoading,
      undefined,
      (data) => {
        if (data.darkMode) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      }
    );
  };

  // Save the user's settings to the backend
  const handleSaveSettings = async () => {
    const userId = sessionStorage.getItem("userId");
    settings.userId = userId;

    const response = await sendFetchRequest(
      `settings/UpdateSettings?userId=${userId}`,
      "PUT",
      setIsLoading,
      setError,
      undefined,
      settings
    );

    if (response && response.message) {
      notifySuccess(response.message);
    }
  };

  // Toggle dark mode
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

  // Toggle notifications
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

      {/* Navigate to UserList for ADMIN */}
      {settings.role === "ADMIN" && (
        <div className="setting-item">
          <button onClick={() => navigate("/users")}>View Users List</button>
        </div>
      )}

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
