import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import AddFeedback from "./AddFeedback";
import {
  calculateIndex,
  formatDateTime,
  highlightText,
  notifyError,
  notifySuccess,
  pagination,
  sendFetchRequest,
  ShowMessageModel,
} from "../Utils/Utils";
import "../Utils/style.css";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]); // Store feedbacks from the API
  const [paginatedData, setPaginatedData] = useState(); // Store parking spots from the API
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Modal message
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0); // Pagination: total pages
  const location = useLocation(); // Get the current location to trigger useEffect
  const navigate = useNavigate(); // Redirect the user to the login page if needed
  const itemsPerPage = 5; // Number of items per page for pagination
  const [searchFormData, setSearchFormData] = useState({
    // Form data for searching feedbacks
    text: "",
    type: "",
    rating: 0,
    date: null,
    userId: 0,
    sortByProperty: "",
  });

  // Fetch feedbacks when the page is loaded
  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      navigate("/login");

      return;
    }

    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage, navigate, location]); // Re-fetch parking spots only when the form is closed

  // Update the feedbacks when the data is fetched
  useEffect(() => {
    if (error && error != null) {
      notifyError(error);
    }

    // Update the feedbacks and total pages when the data is fetched
    if (paginatedData) {
      setFeedbacks(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [error, paginatedData]);

  // Fetch feedbacks from the API
  const fetchFeedbacks = async () => {
    if (sessionStorage.getItem("role") !== "ADMIN") {
      searchFormData.userId = sessionStorage.getItem("userId");
    }

    await sendFetchRequest(
      `feedbacks/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      setError,
      setPaginatedData,
      searchFormData
    );
  };

  // Add a new feedback
  const handleAddSuccess = () => {
    fetchFeedbacks();
    setShowAddForm(false); // Close the add form
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

  // Delete a feedback
  const handleDelete = async (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      const response = await sendFetchRequest(
        `feedbacks/DeleteFeedback/?feedbackId=${feedbackId}`,
        "DELETE",
        setIsLoading,
        setError
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchFeedbacks();
      }
    }
  };

  // Show a modal with the given message
  const handleShowMessage = (message) => {
    setModalMessage(message); // Set the message to be displayed in the modal
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="container">
      <h1>Feedbacks</h1>
      {showAddForm && (
        <AddFeedback
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {!showAddForm && (
        <>
          {/* Search  */}
          <div className="search-filter">
            <input
              type="text"
              name="text"
              placeholder="Search..."
              value={searchFormData.text}
              onChange={handleSearchInputChange}
            />

            {/* Filter */}
            <select
              value={searchFormData.type}
              name="type"
              onChange={handleSearchInputChange}
            >
              <option value="">Filter by Type</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="General">General</option>
            </select>

            {/* Filter by Rating */}
            <select
              value={searchFormData.rating}
              name="rating"
              onChange={handleSearchInputChange}
            >
              <option value="0">Filter by Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            {/* Filter by Date */}
            <input
              type="date"
              name="date"
              placeholder="Filter by Date"
              value={searchFormData.date}
              onChange={handleSearchInputChange}
            />

            {/* Sort */}
            <select
              value={searchFormData.sortByProperty}
              name="sortByProperty"
              onChange={handleSearchInputChange}
            >
              <option value="">Sort by</option>
              <option value="dateTime">Date</option>
              <option value="rating">Rating</option>
              <option value="feedbackType">Type</option>
            </select>
          </div>

          {/* Feedback table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                {sessionStorage.getItem("role") === "ADMIN" && <th>User ID</th>}
                <th>Rating</th>
                <th>Type</th>
                <th>Date Time</th>
                <th>Message</th>
                {sessionStorage.getItem("role") === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
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
                feedbacks &&
                feedbacks.map((feedback, index) => (
                  <tr key={feedback.feedbackId}>
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
                    {sessionStorage.getItem("role") === "ADMIN" && (
                      <td>
                        {highlightText(
                          feedback.userId ? feedback.userId.toString() : "",
                          searchFormData.text
                        )}
                      </td>
                    )}
                    <td>
                      {highlightText(
                        feedback.rating ? feedback.rating.toString() : "",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        feedback.feedbackType ? feedback.feedbackType : "",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        feedback.dateTime
                          ? formatDateTime(feedback.dateTime)
                          : "",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        <button
                          onClick={() => handleShowMessage(feedback.message)}
                        >
                          Show Message
                        </button>
                      )}
                    </td>
                    {sessionStorage.getItem("role") === "ADMIN" && (
                      <td>
                        <button className="delete-button"
                          onClick={() => handleDelete(feedback.feedbackId)}
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

          <button className="add-button" onClick={() => setShowAddForm(true)}>
            Add New Feedback
          </button>
        </>
      )}

      {/* Modal to display feedback message */}
      <ShowMessageModel isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h4>Feedback Message</h4>
        <p>{modalMessage}</p>
      </ShowMessageModel>
    </div>
  );
}
