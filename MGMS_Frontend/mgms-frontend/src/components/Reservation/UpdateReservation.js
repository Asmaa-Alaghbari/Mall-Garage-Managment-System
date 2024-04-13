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
    setReservation({
      reservationId: reservationData.reservationId,
      userId: reservationData.userId,
      parkingSpotId: reservationData.parkingSpotId,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      status: reservationData.status,
    });
  }, [reservationData]);

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
        setMessage(error.message);
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
        <label>
          Reservation ID (Read-only):
          <input
            type="text"
            name="reservationId"
            value={reservation.reservationId}
            readOnly
          />
        </label>
        <label>
          User ID:
          <input
            type="text"
            name="userId"
            value={reservation.userId}
            onChange={handleChange}
            required
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
