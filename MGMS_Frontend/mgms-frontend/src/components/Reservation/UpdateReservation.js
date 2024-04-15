import React, { useState, useEffect } from "react";

export default function UpdateReservation({
  reservationData,
  onUpdated,
  onClose,
}) {
  const [reservation, setReservation] = useState({
    reservationId: "",
    userId: "",
    parkingSpotId: "",
    startTime: "",
    endTime: "",
    status: "",
  });

  useEffect(() => {
    // Preprocess the reservation data to format the date and time
    const preprocessReservationData = {
      ...reservationData,
      startTime: formatDateTime(reservationData.startTime),
      endTime: formatDateTime(reservationData.endTime),
    };

    // Set the reservation state with the preprocessed data
    setReservation(preprocessReservationData);
  }, [reservationData]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Format the date and time to display in the input field for editing
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toISOString().slice(0, 16); // Cut off seconds and milliseconds

    return formattedDate;
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input field
    let formattedValue = value; // Initialize the formatted value with the input value

    // Check if the field is a date field (startTime or endTime) and convert it to UTC
    if (name === "startTime" || name === "endTime") {
      formattedValue = formatDateTime(value);
    }

    // Update the reservation state
    setReservation((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(
      `http://localhost:5296/api/reservations/UpdateReservation?reservationId=${reservation.reservationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reservation),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((text) => {
            throw new Error(text.message || "Failed to update reservation");
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Reservation updated successfully!");
        onUpdated(data);
      })
      .catch((error) => {
        console.error("Error updating reservation:", error);
        setMessage(error.message || "Failed to update reservation");
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(onClose, 3000); // Close form after showing success message
      });
  };

  return (
    <div>
      <h2>Update Reservation</h2>
      <form onSubmit={handleSubmit}>
        Reservation ID (Read-only):
        <input
          type="text"
          name="reservationId"
          value={reservation.reservationId}
          readOnly
          hidden
        />
        <input
          type="text"
          name="userId"
          value={reservation.userId}
          onChange={handleChange}
          required
          readOnly
          hidden
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
          {isLoading ? "Updating..." : "Update Reservation"}
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
