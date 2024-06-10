import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useLocation } from "react-router-dom";
import AddReservation from "./AddReservation";
import {
  calculateDuration,
  calculateIndex,
  fetchCurrentUser,
  formatDateTime,
  highlightText,
  notifySuccess,
  pagination,
  sendFetchRequest,
  ShowMessageModel,
} from "../Utils/Utils";
import "../Utils/style.css";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]); // Store parking spots from the API
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [totalPages, setTotalPages] = useState(1); // Pagination
  const [itemsPerPage] = useState(5); // Display 5 items per page
  const [startTime, setModalStartTime] = useState("");
  const [endTime, setModalEndTime] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [singleReservation, setSingleReservation] = useState(null); // Store a single reservation
  const [searchFormData, setSearchFormData] = useState({
    text: "",
    status: "",
    date: null,
    sortByProperty: "",
  });
  const location = useLocation(); // Get the current location
  const searchParams = new URLSearchParams(location.search); // Get the URL search params
  const onlyShowReservationId = searchParams.get("id"); // Get the reservation ID from the URL

  // Fetch reservations and current user on component mount
  useEffect(() => {
    const fetchData = () => {
      fetchReservations();
      fetchCurrentUser(setUser, setIsLoading, setError);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]); // Re-fetch parking spots only when the form is closed

  // Fetch a single reservation with the given ID
  useEffect(() => {
    if (paginatedData) {
      setReservations(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }

    // If onlyShowReservationId is set, fetch the reservation with the given ID
    if (singleReservation && singleReservation !== null) {
      setReservations([]);

      setReservations((prevReservations) => [
        ...prevReservations,
        singleReservation,
      ]);
    }
  }, [error, paginatedData, singleReservation]);

  // Fetch reservations from the API and update the state
  const fetchReservations = async () => {
    // If onlyShowReservationId is set, fetch the reservation with the given ID
    if (onlyShowReservationId && onlyShowReservationId !== 0) {
      setReservations([]);

      await sendFetchRequest(
        `reservations/GetReservationById?reservationId=${onlyShowReservationId}`,
        "GET",
        setIsLoading,
        setError,
        setSingleReservation
      );
    }

    // Fetch all reservations
    await sendFetchRequest(
      `reservations/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      setError,
      setPaginatedData,
      searchFormData
    );
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    if (e.target.name === "date" && e.target.value === "") {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        date: null,
      }));
    } else {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle page change
  const handleSuccess = () => {
    const response = fetchReservations();

    if (response && response.message) {
      notifySuccess(response.message);
    }

    setShowUpdateForm(false);
    setShowAddForm(false);
  };

  // Delete reservation by ID
  const handleDelete = async (reservationId) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      const response = await sendFetchRequest(
        `reservations/DeleteReservation/?reservationId=${reservationId}`,
        "DELETE",
        setIsLoading,
        setError
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchReservations();
      }
    }
  };

  // Show a modal with the given message
  const handleShowMessage = (startTime, endTime) => {
    setModalStartTime(startTime);
    setModalEndTime(endTime);
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="container">
      <h1>Reservations</h1>
      {showAddForm && (
        <AddReservation
          onAddSuccess={() => handleSuccess(false)}
          onClose={() => {
            setShowAddForm(false);
            setSelectedReservation(null);
          }}
          isUpdate={false}
          onClick={() => setShowAddForm(true)}
        />
      )}
      {showUpdateForm && selectedReservation && (
        <AddReservation
          onAddSuccess={() => handleSuccess(true)}
          onClose={() => {
            setShowUpdateForm(false);
            setSelectedReservation(null);
          }}
          isUpdate={true}
          reservationData={selectedReservation}
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {/* Search */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchFormData.text}
              name="text"
              onChange={handleSearchInputChange}
            />

            {/* Filter by status */}
            <select
              value={searchFormData.status}
              name="status"
              onChange={handleSearchInputChange}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Filter by date */}
            {/* <input
              type="date"
              placeholder="Date..."
              value={searchFormData.date}
              name="date"
              onChange={handleSearchInputChange}
            /> */}

            {/* Sort by reservationId, startTime, or endTime */}
            <select
              value={searchFormData.sortByProperty}
              onChange={handleSearchInputChange}
              name="sortByProperty"
            >
              <option value="">Sort by...</option>
              <option value="ReservationId">Reservation ID</option>
              <option value="StartTime">Start Time</option>
              <option value="EndTime">End Time</option>
            </select>
          </div>

          {/* Reservation table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                {user && user.role === "ADMIN" && <th>Reservation ID</th>}
                <th>Parking spot number</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Time Details</th>
                {user && user.role === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: "40px",
                      }}
                    >
                      <BeatLoader
                        color="#000000"
                        loading={isLoading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading &&
                reservations &&
                reservations.map((reservation, index) => (
                  <tr key={reservation.reservationId}>
                    <td>
                      {highlightText(
                        calculateIndex(
                          index,
                          currentPage,
                          itemsPerPage
                        ).toString(),
                        searchFormData.text
                      )}
                    </td>
                    {user && user.role === "ADMIN" && (
                      <td>
                        {highlightText(
                          reservation.reservationId.toString(),
                          searchFormData.text
                        )}
                      </td>
                    )}
                    <td>
                      {highlightText(
                        reservation.parkingSpotNumber.toString(),
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(reservation.status, searchFormData.text)}
                    </td>
                    <td>
                      {highlightText(
                        calculateDuration(
                          reservation.startTime,
                          reservation.endTime
                        ),
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        <button
                          onClick={() =>
                            handleShowMessage(
                              formatDateTime(reservation.startTime),
                              formatDateTime(reservation.endTime)
                            )
                          }
                        >
                          Display Time Details
                        </button>
                      )}
                    </td>

                    {user && user.role === "ADMIN" && (
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
                          onClick={() =>
                            handleDelete(reservation.reservationId)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {pagination(totalPages, currentPage, setCurrentPage)}
          </div>

          <button onClick={() => setShowAddForm(true)}>Add Reservation</button>
        </>
      )}
      {/* Modal to display feedback message */}
      <ShowMessageModel isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h4>Time Details</h4>
        <p>Start time: {startTime}</p>
        <p>End time: {endTime}</p>
      </ShowMessageModel>
    </div>
  );
}
