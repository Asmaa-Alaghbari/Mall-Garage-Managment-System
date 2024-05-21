import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  notifyError,
  notifySuccess,
  sendFetchRequest,
} from "../Utils/Utils";
import "./Profile.css";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profileInfo, setProfileInfo] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profilePictureUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Fetch the user's profile data when the component mounts (on initial render)
  useEffect(() => {
    // Fetch the user's profile data from the backend
    fetchCurrentUser(setUserInfo, setIsLoading, setErrorMessage, () => {});
    fetchUserProfile(setProfileInfo, setIsLoading, setErrorMessage);
  }, []);

  // Fetch the user's profile data from the backend
  const fetchUserProfile = async () => {
    await sendFetchRequest(
      "auth/GetUserProfile",
      "GET",
      setIsLoading,
      setErrorMessage,
      setProfileInfo
    );
  };

  // Handle changes in the user's information
  const handleUserInfoChange = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }
  };

  // Handle changes in the user's profile information
  const handleProfileInfoChange = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  // Handle form submission and update the user's profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    // Validate user ID and token
    if (!userId || !token) {
      notifyError("User ID or token not found! Please log in again!");
      return;
    }

    if (!password || password === "") {
      notifyError("Please insert your password!");
      return;
    }

    userInfo.password = password;

    const userResponse = await sendFetchRequest(
      `auth/Update?userId=${userId}`,
      "PUT",
      setIsLoading,
      setErrorMessage,
      undefined,
      userInfo
    );

    // If the user update is successful, update the user's profile
    if (userResponse && userResponse.success) {
      const profileResponse = await sendFetchRequest(
        `auth/UpdateUserProfile`,
        "PUT",
        setIsLoading,
        setErrorMessage,
        undefined,
        profileInfo
      );

      // If the profile update is successful, notify the user and update the user's data
      if (profileResponse && profileResponse.message) {
        notifySuccess(profileResponse.message);

        fetchCurrentUser(setUserInfo, setIsLoading, setErrorMessage, () => {});
        fetchUserProfile();
      }
    }
  };

  // Close the profile form and navigate to the home page
  const handleClose = () => {
    navigate("/home");
  };

  return (
    <div className="profile-form-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={userInfo.firstName || ""}
          onChange={handleUserInfoChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={userInfo.lastName || ""}
          onChange={handleUserInfoChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userInfo.username || ""}
          disabled
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email || ""}
          onChange={handleUserInfoChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={userInfo.phone || ""}
          onChange={handleUserInfoChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profileInfo.address || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={profileInfo.city || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={profileInfo.state || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={profileInfo.zipCode || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={profileInfo.country || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="text"
          name="profilePictureUrl"
          placeholder="Profile Picture URL"
          value={profileInfo.profilePictureUrl || ""}
          onChange={handleProfileInfoChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Input password to save changes..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
          <button onClick={handleClose}>Close</button>
        </div>
      </form>
    </div>
  );
}
