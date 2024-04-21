import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddFeedback from "./AddFeedback";

import "./Feedback.css";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]); // Store feedbacks from the API
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page
  const [itemsPerPage] = useState(10); // Pagination: items per page
  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [filterBy, setFilterBy] = useState("all"); // Filter
  const [filterByRating, setFilterByRating] = useState(""); // Filter by rating
  const [filterByDate, setFilterByDate] = useState(""); // Filter by date
  const [sortBy, setSortBy] = useState("userId"); // Sort
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Get the current location to trigger useEffect
  const navigate = useNavigate(); // Redirect the user to the login page if needed

  useEffect(() => {
    setIsLoading(true);

    const userId = localStorage.getItem("userId");
    console.log("Using userId:", userId); // Debugging statement

    // Check if userId is available
    if (!userId) {
      setError("User ID is missing or invalid. Please log in again.");
      setIsLoading(false);
      navigate("/login"); // Redirect to login or show a re-login prompt
      return;
    }

    // Define the URL based on the user role (ADMIN or USER)
    const url =
      localStorage.getItem("role") === "ADMIN"
        ? "http://localhost:5296/api/feedbacks/GetAllFeedbacks"
        : `http://localhost:5296/api/feedbacks/GetFeedbackByUserId?userId=${userId}`;

    // Fetch feedbacks from the server
    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data); // Debugging statement

        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else if (data.emptyFeedbackList) {
          setFeedbacks(data.emptyFeedbackList);
        } else {
          throw new Error("Invalid data format");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [location]); // Fetch feedbacks once when the component mounts

  const handleAddSuccess = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]); // Add the new feedback to the list
    setShowAddForm(false); // Close the add form
  };

  const handleDelete = (feedbackId) => {
    // Ask the user to confirm the deletion
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      fetch(
        `http://localhost:5296/api/feedbacks/DeleteFeedback?feedbackId=${feedbackId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
        .then((response) => {
          if (!response.ok) {
            // If the server responds with an error, throw an error
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to delete feedback");
            });
          }
          // If delete was successful, filter out the deleted feedback
          setFeedbacks(
            feedbacks.filter((feedback) => feedback.feedbackId !== feedbackId)
          );
          alert("Feedback deleted successfully!");
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

  // Filtering feedbacks based on search term and filter
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const searchTermLower = searchTerm.toLowerCase();
    const filterByLower = filterBy.toLowerCase();
    const feedbackTypeLower = feedback.feedbackType.toLowerCase();
    const messageLower = feedback.message.toLowerCase();
    const userId = feedback.userId.toString();

    const ratingMatch =
      filterByRating === "" || feedback.rating.toString() === filterByRating;
    const typeMatch =
      filterByLower === "all" || filterByLower === feedbackTypeLower;
    const dateMatch =
      filterByDate === "" ||
      new Date(feedback.dateTime).toISOString().split("T")[0] === filterByDate;

    return (
      (searchTermLower === "" ||
        userId.includes(searchTermLower) ||
        feedback.rating.toString().includes(searchTermLower) ||
        feedbackTypeLower.includes(searchTermLower) ||
        messageLower.includes(searchTermLower)) &&
      ratingMatch &&
      typeMatch &&
      dateMatch
    );
  });

  // Sorting feedbacks
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    if (sortBy === "dateTime") {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(); // Sorting by dateTime in ascending order
    }
    if (sortBy === "rating") {
      return a.rating - b.rating; // Sorting by rating in ascending order
    }
    if (sortBy === "feedbackType") {
      return a.feedbackType.localeCompare(b.feedbackType);
    }

    // Default sort by userId in ascending order
    return a.userId - b.userId;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFeedbacks = sortedFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedFeedbacks.length / itemsPerPage);

  // Highlight the search term in the text
  const highlightText = (text, highlight) => {
    if (typeof text !== "string" || typeof highlight !== "string") {
      return text; // Return text as is if it's not a string
    }

    // Escape special characters in the highlight term for regex
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Split the text into parts and highlight the search term
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));
    return parts.map((part, index) => (
      <span
        key={index}
        className={
          part.toLowerCase() === highlight.toLowerCase() ? "highlight" : ""
        }
      >
        {part}
      </span>
    ));
  };

  if (isLoading) return <div>Loading feedbacks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feedback-container">
      <h1>Feedbacks</h1>
      {showAddForm && (
        <AddFeedback
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {!showAddForm && (
        <>
          {feedbacks && feedbacks.length === 0 ? (
            <div className="no-feedbacks">
              <p>No feedbacks found for this user, do you want to add one?</p>
              <button onClick={() => setShowAddForm(true)}>
                Add New Feedback
              </button>
            </div>
          ) : (
            <>
              {/* Search  */}
              <div className="search-sort">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filter */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">Filter by Type</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General">General</option>
                </select>
                {/* Filter by Rating */}
                <input
                  type="number"
                  placeholder="Filter by Rating"
                  value={filterByRating}
                  min="1" // Minimum rating
                  max="5" // Maximum rating
                  onChange={(e) => {
                    // Ensure the rating is between 1 and 5
                    if (e.target.value >= 1 && e.target.value <= 5) {
                      setFilterByRating(e.target.value);
                    }
                  }}
                />

                {/* Filter by Date */}
                <input
                  type="date"
                  placeholder="Filter by Date"
                  value={filterByDate}
                  onChange={(e) => setFilterByDate(e.target.value)}
                />

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="all">Sort by</option>
                  <option value="dateTime">Date</option>
                  <option value="rating">Rating</option>
                  <option value="feedbackType">Type</option>
                </select>
              </div>

              {/* Feedback table */}
              <table className="feedback-table">
                <thead>
                  <tr>
                    {localStorage.getItem("role") === "ADMIN" && (
                      <th>User ID</th>
                    )}
                    <th>Rating</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Date Time</th>
                    {localStorage.getItem("role") === "ADMIN" && (
                      <th>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback) => (
                    <tr key={feedback.feedbackId}>
                      {localStorage.getItem("role") === "ADMIN" && (
                        <td>
                          {highlightText(
                            feedback.userId.toString(),
                            searchTerm
                          )}
                        </td>
                      )}
                      <td>
                        {highlightText(feedback.rating.toString(), searchTerm)}
                      </td>
                      <td>
                        {highlightText(feedback.feedbackType, searchTerm)}
                      </td>
                      <td>{highlightText(feedback.message, searchTerm)}</td>
                      <td>
                        {highlightText(
                          formatDateTime(feedback.dateTime),
                          searchTerm
                        )}
                      </td>
                      {localStorage.getItem("role") === "ADMIN" && (
                        <td>
                          <button
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

              <button onClick={() => setShowAddForm(true)}>
                Add New Feedback
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}