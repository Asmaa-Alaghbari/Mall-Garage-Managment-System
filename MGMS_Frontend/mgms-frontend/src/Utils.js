// Utils.js Common utility functions
import React from "react";

// Fetch the current user data from the backend
export const fetchCurrentUser = async (setModel, setIsLoading, setError) => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:5296/api/auth/GetUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const userData = await response.json();
    console.log("Fetched user data:", userData);

    if (userData.userId) {
      setModel((prev) => ({
        ...prev,
        userId: userData.userId,
        username: userData.username, 
      role: userData.role 
      }));
    } else {
      throw new Error("UserId not found in user data");
    }
  } catch (err) {
    console.error("Fetch user error:", err);
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

// Format date and time
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US");
};

// Highlight the search term in the text
export const highlightText = (text, highlight) => {
  if (!text || !highlight) {
    return text; // Return text as is if either text or highlight is undefined
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// Paginate array
export const paginate = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return items.slice(indexOfFirstItem, indexOfLastItem);
};

// Handle the actual logout process and redirect the user to the login page
export const handleLogout = ({ setIsLoggedIn, navigate }) => {
  localStorage.removeItem("token"); // Remove the token from local storage
  setIsLoggedIn(false); // Update the login state to false
  navigate("/login"); // Redirect the user to the login page
};

// Call the confirmation dialog before performing logout
export const confirmLogout = ({ setIsLoggedIn, navigate }) => {
  // Display a confirmation dialog to the user
  if (window.confirm("Are you sure you want to log out?")) {
    handleLogout({ setIsLoggedIn, navigate });
  }
};
