import React, { useState, useEffect } from "react";
import AddReservation from "./AddReservation";
import UpdateReservation from "./UpdateReservation";
import "./Reservations.css";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm && !showUpdateForm) {
      fetchReservations();
    }
  }, [showAddForm, showUpdateForm]);

  const fetchReservations = () => {
    setIsLoading(true);
    fetch("http://localhost:5296/api/reservations/GetAllReservations", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        return response.json();
      })
      .then((data) => {
        setReservations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setError(error.message);
        setIsLoading(false);
      });
  };

  const handleAddSuccess = (newReservation) => {
    setReservations([...reservations, newReservation]);
    setShowAddForm(false);
  };

  const handleUpdateSuccess = (updatedReservation) => {
    const updatedReservations = reservations.map((reservation) =>
      reservation.reservationId === updatedReservation.reservationId
        ? updatedReservation
        : reservation
    );
    setReservations(updatedReservations);
    setShowUpdateForm(false);
  };

  const handleDelete = (reservationId) => {
    // Ask the user to confirm the deletion
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      fetch(
        `http://localhost:5296/api/reservations/DeleteReservation?reservationId=${reservationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
        .then((response) => {
          if (!response.ok) {
            // If the server responds with an error, throw an error
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to delete reservation");
            });
          }
          // If delete was successful, filter out the deleted reservation
          setReservations(
            reservations.filter(
              (reservation) => reservation.reservationId !== reservationId
            )
          );
          alert("Reservation deleted successfully!");
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert(error.message);
        });
    }
  };

  if (isLoading) return <div>Loading reservations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservations-container">
      <h1>Reservations</h1>
      {showAddForm && (
        <AddReservation
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {showUpdateForm && selectedReservation && (
        <UpdateReservation
          reservationData={selectedReservation}
          onUpdated={handleUpdateSuccess}
          onClose={() => setShowUpdateForm(false)}
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {reservations.map((reservation) => (
            <li key={reservation.reservationId}>
              Reservation ID: {reservation.reservationId}, Start Time:{" "}
              {reservation.startTime}, End Time: {reservation.endTime}, Status:{" "}
              {reservation.status}
              <button
                onClick={() => {
                  setSelectedReservation(reservation); // Set the selected reservation for update
                  setShowUpdateForm(true); // Show the update form
                }}
              >
                Update
              </button>
              <button onClick={() => handleDelete(reservation.reservationId)}>
                Delete
              </button>
            </li>
          ))}
          <button onClick={() => setShowAddForm(true)}>
            Add New Reservation
          </button>
        </>
      )}
    </div>
  );
}

