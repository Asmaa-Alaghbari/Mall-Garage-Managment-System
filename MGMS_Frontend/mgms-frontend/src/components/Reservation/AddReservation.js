import React, { useState, useEffect } from "react";

export default function AddReservation({ onAddSuccess, onClose }) {
  // Initialize the reservation state with user ID pre-populated if user data is available
  const [reservation, setReservation] = useState({
    userId: "", // Pre-populate the user ID if user data is available
    parkingSpotId: "",
    startTime: "",
    endTime: "",
    status: "Pending", // Default status is "Pending" for new reservations
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch the user data from the backend using the token for authentication
        const response = await fetch("http://localhost:5296/api/auth/GetUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        // Parse the response body as JSON
        const userData = await response.json();
        console.log("Fetched user data:", userData); // Log the fetched user data

        // Check if the UserId field exists in the userData
        if (userData.userId) {
          setReservation((prev) => ({
            ...prev,
            userId: userData.userId, // Populate userId with the fetched ID
          }));
        } else {
          console.error("UserId not found in user data");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Update the reservation state
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a date field (startTime or endTime) and convert it to UTC
    if (name === "startTime" || name === "endTime") {
      const date = new Date(value);
      const utcDate = new Date(date.toUTCString().slice(0, -4)); // Remove the 'GMT' from the end

      // Update the reservation state with the UTC date
      setReservation((prev) => ({
        ...prev,
        [name]: utcDate.toISOString(), // Convert UTC date back to string
      }));
    } else {
      // Update the reservation state with the new value
      setReservation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://localhost:5296/api/reservations/AddReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reservation),
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to create reservation");
            });
          } else {
            throw new Error("Unexpected response from server");
          }
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Reservation added successfully!");
        onAddSuccess(data);
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Add Reservation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userId"
          value={reservation.userId}
          onChange={handleChange}
          required
          readOnly // User ID is read-only since it's automatically set
          hidden // Hide the user ID field from the form
        />
        <label>
          Parking Spot ID:
          <input
            type="text"
            name="parkingSpotId"
            value={reservation.parkingSpotId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Start Time:
          <input
            type="datetime-local"
            name="startTime"
            value={reservation.startTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            name="endTime"
            value={reservation.endTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Status:
          <input
            type="text"
            name="status"
            value={reservation.status}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Reservation"}
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
      {message && (
        <p
          className={
            message.includes("successfully")
              ? "message-success"
              : "message-error"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
