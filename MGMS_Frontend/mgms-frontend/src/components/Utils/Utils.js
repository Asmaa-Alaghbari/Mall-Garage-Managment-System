// Utils.js Common utility functions
import React from "react";
import { toast, Zoom } from "react-toastify"; // For notifications

// Fetch the current user data from the backend
export const fetchCurrentUser = async (
  setModel,
  setIsLoading,
  setError,
  setUserRole
) => {
  setIsLoading(true);
  try {
    const token = sessionStorage.getItem("token");
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

    if (userData.userId) {
      if (setModel) {
        setModel((prev) => ({
          ...prev,
          userId: userData.userId,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: userData.role,
        }));
      }

      if (setUserRole) {
        setUserRole(userData.role); // Set user role in state
      }
    } else {
      throw new Error("UserId not found in user data");
    }
  } catch (err) {
    console.error("Fetch user error:", err);
    if (setError) {
      setError(err.message);
    }
  } finally {
    setIsLoading(false);
  }
};

// Format date and time
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US");
};

// Format date to ISO string without offset
export function formatDateToISOWithoutOffset(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calculate the correct index for the "No." column
export const calculateIndex = (index, currentPage, itemsPerPage) => {
  return index + 1 + (currentPage - 1) * itemsPerPage;
};

// Calculate the duration between two dates
export const calculateDuration = (start, end) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const duration = endTime - startTime;
  const hours = Math.floor(duration / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((duration % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Send a fetch request to the backend API
export const sendFetchRequest = async (
  endpoint,
  method,
  setLoading,
  setError,
  setReturnedData,
  dto = null,
  includeCredentials = false
) => {
  let returnedResponse;

  setLoading(true);

  const requestOptions = {
    method: method || "POST", // Use the provided method or default to "POST"
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: dto ? JSON.stringify(dto) : undefined, // Only stringify if data is provided,
    credentials: includeCredentials ? "include" : undefined, // Include credentials if specified
  };

  // Send the fetch request to the backend API
  await fetch(`http://localhost:5296/api/${endpoint}`, requestOptions)
    .then((response) => {
      returnedResponse = response;

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "An error occurred.");
        });
      }

      returnedResponse = response.json();

      return returnedResponse;
    })
    .then((data) => {
      if (data && setReturnedData) {
        setReturnedData(data);
      }
    })
    .catch((error) => {
      if (error && error !== null) {
        if (!error.message) {
          notifyError("Failed to fetch from server!");
        } else {
          notifyError(error.message);
        }
      }
      if (setError) {
        setError(error);
      }
    })
    .finally(() => {
      setLoading(false);
    });

  return returnedResponse;
};

// Send notification to the user
export const sendNotification = async (
  userId,
  reservationId,
  message,
  setIsLoading,
  setError
) => {
  const notificationData = {
    userId: userId,
    reservationId: reservationId ?? null,
    message: message,
  };

  await sendFetchRequest(
    "notifications/AddNotification",
    "POST",
    setIsLoading,
    setError,
    undefined,
    notificationData
  );
};

// Send notification to a specific role
export const sendNotificationToRole = async (
  role,
  reservationId,
  message,
  setIsLoading,
  setError
) => {
  const notificationData = {
    message: message,
    reservationId: reservationId ?? null,
  };

  await sendFetchRequest(
    `notifications/AddNotificationForRole?role=${role}`,
    "POST",
    setIsLoading,
    setError,
    undefined,
    notificationData
  );
};

// Notify the user with a success or error message
export const notifyError = (message) => {
  toast.error(message, {
    position: "top-right", // Set the position of the notification
    autoClose: 5000, // Close the notification after 5 seconds
    hideProgressBar: false, // Show the progress bar
    closeOnClick: true, // Close the notification when clicked
    pauseOnHover: true, // Pause the notification when hovered
    draggable: true, // Allow the notification to be dragged
    progress: undefined, // Progress bar
    theme: "light", // Light theme
    transition: Zoom, // Zoom transition
  });
};

// Notify the user with a success message
export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Zoom,
  });
};

// Highlight the search term in the text
export const highlightText = (text, highlight) => {
  if (!text || !highlight || typeof text !== "string") {
    // Return text as is if either text or highlight is undefined or if text is not a string
    return text;
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

// Show a message dialog with the given content and a close button
export const ShowMessageModel = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <div className="modal-content">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

// Paginate array
export const paginate = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return items.slice(indexOfFirstItem, indexOfLastItem);
};

// Pagination component to navigate through pages (previous, next, and page numbers)
export const pagination = (totalPages, currentPage, setCurrentPage) => {
  const renderPages = () => {
    const pages = [];

    // If total pages are less than or equal to 1, return null
    if (totalPages <= 1) {
      return null;
    }

    // Add first and previous buttons
    if (currentPage > 1) {
      pages.push(
        <button key="first" onClick={() => setCurrentPage(1)}>
          {"<<"}
        </button>
      );
      pages.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)}>
          {"<"}
        </button>
      );
    }

    // Determine the range of page numbers to display
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    // Display the page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Add next and last buttons
    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)}>
          {">"}
        </button>
      );
      pages.push(
        <button key="last" onClick={() => setCurrentPage(totalPages)}>
          {">>"}
        </button>
      );
    }

    return pages;
  };

  return <div className="pagination">{renderPages()}</div>;
};

// Handle the actual logout process and redirect the user to the login page
export const handleLogout = ({ setIsLoggedIn, navigate }) => {
  sessionStorage.removeItem("token"); // Remove the token from local storage
  notifySuccess("Logged out!"); // Notify user of successful logout
  setIsLoggedIn(false); // Update the login state to false
  navigate("/login"); // Redirect the user to the login page
};

// Call the confirmation dialog before performing logout
export const confirmLogout = ({ setIsLoggedIn, navigate }) => {
  // Display a confirmation dialog to the user
  if (window.confirm("Are you sure you want to log out?")) {
    handleLogout({ setIsLoggedIn, navigate });
  } else {
    notifyError("Logout cancelled!"); // Notify user of cancelled logout
  }
};
