import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    address: "", // Optional
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  // Fetch the user's profile data when the component mounts (on initial render)
  useEffect(() => {
    // Fetch the user's profile data from the backend
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5296/api/auth/GetUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Could not fetch profile data.");
        }
        const userData = await response.json(); // Assuming the backend returns the user's profile in JSON format
        setProfileData({
          ...userData, // Spread userData directly
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        setErrorMessage("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input field changes and update the profile data state
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle form submission and update the user's profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5296/api/auth/Update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profileData, password }),
      });
      if (!response.ok) {
        throw new Error("Could not update profile.");
      }
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-form-container">
      <h1>Profile</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={profileData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={profileData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={profileData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profileData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={profileData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profileData.address}
          onChange={handleChange}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
