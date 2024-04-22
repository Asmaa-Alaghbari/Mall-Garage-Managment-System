import React, { useState, useEffect } from "react";

export default function AddReservation({
  onAddSuccess, // Callback function to handle successful reservation addition
  onUpdateSuccess, // Callback function to handle successful reservation update
  onClose, // Callback function to handle form close
  isUpdate = false, // Flag to determine if the form is for updating a reservation
  reservationData = null, // Reservation data to pre-populate the form for update
}) {
  // Initialize the reservation state with user ID pre-populated if user data is available
  const [reservation, setReservation] = useState({
    userId: "", // Pre-populate the user ID if user data is available
    parkingSpotId: "",
    startTime: "",
    endTime: "",
    status: "Pending", // Default status is "Pending" for new reservations
  });
  const [userRole, setUserRole] = useState(""); // State to hold user role
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [, setError] = useState(null);

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

        // Set user role
        setUserRole(userData.role); // Assuming the role is stored in userData.role
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    console.log("Reservation data:", reservationData); // Log the reservation data

    if (isUpdate && reservationData) {
      // Map the properties from reservationData to the reservation state
      const updatedReservation = {
        ...reservation,
        ...reservationData,
        startTime: reservationData.startTime
          ? new Date(reservationData.startTime).toISOString().slice(0, 16)
          : "", // Format startTime
        endTime: reservationData.endTime
          ? new Date(reservationData.endTime).toISOString().slice(0, 16)
          : "", // Format endTime
      };

      setReservation(updatedReservation);
    }
  }, [isUpdate, reservation, reservationData]);

  // Update the reservation state
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a date field (startTime or endTime) and convert it to UTC
    if (name === "startTime" || name === "endTime") {
      // Convert the local date and time to ISO string
      const localDate = new Date(value);
      const utcDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes()
        )
      );

      // Format the UTC date to match datetime-local format: YYYY-MM-DDTHH:mm
      const formattedDate = utcDate.toISOString().slice(0, 16);
      console.log("Formatted date:", formattedDate); // Log the formatted date

      // Update the reservation state with the UTC date
      setReservation((prev) => ({
        ...prev,
        [name]: formattedDate, // Convert UTC date back to string
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

    const apiUrl = isUpdate
      ? `http://localhost:5296/api/reservations/UpdateReservation?reservationId=${reservationData.reservationId}`
      : "http://localhost:5296/api/reservations/AddReservation";

    fetch(apiUrl, {
      method: isUpdate ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reservation),
    })
      .then((response) => {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to create reservation");
            });
          } else {
            return response.text().then((text) => {
              console.error("Server Error Response:", text);
              if (text === "Parking spot doesn't exist.") {
                throw new Error("Parking spot doesn't exist.");
              } else {
                throw new Error("Unexpected response from server");
              }
            });
          }
        }
        return response.json();
      })
      .then((data) => {
        if (isUpdate) {
          onUpdateSuccess(data);
          setMessage("Reservation updated successfully!");
        } else {
          onAddSuccess(data);
          setMessage("Reservation added successfully!");
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <h2>{isUpdate ? "Update Reservation" : "Add Reservation"}</h2>
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
        {userRole === "ADMIN" && (
          <label>
            Status:
            <select
              type="text"
              name="status"
              value={reservation.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        )}
        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Updating..."
              : isUpdate
              ? "Update Reservation"
              : "Add Reservation"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
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
