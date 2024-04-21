import React, { useState, useEffect } from "react";
import AddReservation from "./AddReservation";
import UpdateReservation from "./UpdateReservation";
import "./Reservations.css";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [statusFilter, setStatusFilter] = useState("all"); // Filter
  const [dateFilter, setDateFilter] = useState(""); // Date filter
  const [sortType, setSortType] = useState("reservationId"); // Sort by reservation ID by default
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [itemsPerPage] = useState(10); // Display 5 items per page
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

  // Display date and time in a more readable format
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US");
  };

  // Filter reservations based on search term and status
  const filteredReservations = reservations.filter((reservation) => {
    // Check if the date and time match the filter
    const isDateMatch = dateFilter
      ? reservation.startTime.includes(dateFilter) ||
        reservation.endTime.includes(dateFilter)
      : true;

    return (
      // Check if the reservation ID, start time, or end time includes the search term
      (reservation.reservationId.toString().includes(searchTerm) ||
        reservation.startTime.includes(searchTerm) ||
        reservation.endTime.includes(searchTerm)) &&
      (statusFilter === "all" ||
        reservation.status.toLowerCase() === statusFilter.toLowerCase()) &&
      isDateMatch
    );
  });

  // Sort reservations
  let sortedReservations = [...filteredReservations];

  if (sortType === "reservationId") {
    sortedReservations = sortedReservations.sort(
      (a, b) => a.reservationId - b.reservationId
    );
  } else if (sortType === "startTime") {
    sortedReservations = sortedReservations.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  } else if (sortType === "endTime") {
    sortedReservations = sortedReservations.sort((a, b) =>
      a.endTime.localeCompare(b.endTime)
    );
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedReservations = sortedReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

  // Highlight the search term in the text
  const highlightText = (text, highlight) => {
    if (typeof text !== "string" || typeof highlight !== "string") {
      return text; // Return text as is if it's not a string
    }

    // Split the text into parts and highlight the search term
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
          {/* Filters */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Filter by status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {/* Filter by date */}
            <input
              type="date"
              placeholder="Date..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            {/* Sort by reservationId, startTime, or endTime */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="reservationId">Reservation ID</option>
              <option value="startTime">Start Time</option>
              <option value="endTime">End Time</option>
            </select>
          </div>

          {/* Reservation table */}
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.reservationId}>
                  <td>
                    {highlightText(
                      reservation.reservationId.toString(),
                      searchTerm
                    )}
                  </td>
                  <td>
                    {highlightText(
                      formatDateTime(reservation.startTime),
                      searchTerm
                    )}
                  </td>
                  <td>
                    {highlightText(
                      formatDateTime(reservation.endTime),
                      searchTerm
                    )}
                  </td>
                  <td>{highlightText(reservation.status, searchTerm)}</td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowUpdateForm(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.reservationId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              )}
          </div>
          <button onClick={() => setShowAddForm(true)}>Add Reservation</button>
        </>
      )}
    </div>
  );
}