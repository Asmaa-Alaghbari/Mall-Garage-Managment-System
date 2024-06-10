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
        <span>
          <i className="fas fa-moon"></i> Dark Mode
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={handleDarkModeToggle}
          />
          <span className="slider">
            <i className="fas fa-sun sun-icon"></i>
            <i className="fas fa-moon moon-icon"></i>
          </span>
        </label>
      </div>

      {/* Notifications Toggle */}
      <div className="setting-item">
        <span>
          <i className="fas fa-bell"></i> Notifications
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.receiveNotifications}
            onChange={handleNotificationsToggle}
          />
          <span className="slider">
            <i className="fas fa-bell bell-on-icon"></i>
            <i className="fas fa-bell-slash bell-off-icon"></i>
          </span>
        </label>
      </div>

      {/* Save and Log Out Buttons */}
      <div className="setting-item button-item">
        <button onClick={handleSaveSettings} disabled={isLoading}>
          <i className="fas fa-save"></i>
          {isLoading ? " Saving..." : " Save Settings"}
        </button>
        <button
          className="logout-btn"
          onClick={() => confirmLogout({ setIsLoggedIn, navigate })}
        >
          <i className="fas fa-sign-out-alt"></i>
          Log Out
        </button>
      </div>

      {/* Display Success Message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
}


