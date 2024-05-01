import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "./Utils";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Fetch the user's profile data when the component mounts (on initial render)
  useEffect(() => {
    // Fetch the user's profile data from the backend
    fetchCurrentUser(setUserInfo, setIsLoading, setErrorMessage, () => {});
    fetchUserProfile(setProfileInfo, setIsLoading, setErrorMessage);
  }, []);

  const fetchUserProfile = async (setProfileInfo, setIsLoading, setError) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "http://localhost:5296/api/auth/GetUserProfile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user's profle: ${response.statusText}`
        );
      }

      const userData = await response.json();
      console.log("Fetched user's profile data:", userData);

      if (userData.userId) {
        setProfileInfo((prev) => ({
          ...prev,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode,
          country: userData.country,
          profilePictureUrl: userData.profilePictureUrl,
        }));
      } else {
        throw new Error("UserId not found in user's profile data");
      }
    } catch (err) {
      console.error("Fetch user's profile error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleProfileInfoChange = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  // Handle form submission and update the user's profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Validate user ID and token
    if (!userId || !token) {
      setErrorMessage("User ID or token not found. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      // Update user info
      const userResponse = await fetch(
        `http://localhost:5296/api/auth/Update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...userInfo,
          }),
        }
      );

      // Check if response body is empty
      const userResult =
        userResponse.status !== 204 ? await userResponse.json() : {};

      if (!userResponse.ok) {
        const errorMessage = userResult.message || "Unknown error";
        throw new Error(`Could not update user info. ${errorMessage}`);
      }

      // Update user profile
      const profileResponse = await fetch(
        "http://localhost:5296/api/auth/UpdateUserProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileInfo),
        }
      );

      // Check if response body is empty
      const profileResult =
        profileResponse.status !== 204 ? await profileResponse.json() : {};

      if (!profileResponse.ok) {
        const errorMessage = profileResult.message || "Unknown error";
        throw new Error(`Could not update profile. ${errorMessage}`);
      }

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(
        error.message || "Could not update user info. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Close the profile form and navigate to the home page
  const handleClose = () => {
    navigate("/home");
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
          onChange={handleUserInfoChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email || ""}
          onChange={handleUserInfoChange}
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
