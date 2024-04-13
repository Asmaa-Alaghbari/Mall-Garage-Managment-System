import React, { useState } from "react";

export default function AddReservation({ user, onAddSuccess, onClose }) {
  // Initialize the reservation state with user ID pre-populated if user data is available
  const [reservation, setReservation] = useState({
    userId: user ? user.id : "", // Pre-populate the user ID if user data is available
    parkingSpotId: "",
    startTime: "",
    endTime: "",
    status: "Pending", // Default status is "Pending" for new reservations
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://localhost:5296/api/reservations/CreateReservation", {
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
        <label>
          User ID (Read-only):
          <input
            type="text"
            name="userId"
            value={reservation.userId}
            onChange={handleChange}
            required
            readOnly // User ID is read-only since it's automatically set
          />
        </label>
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
