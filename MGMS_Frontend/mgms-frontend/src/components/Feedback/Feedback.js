import React, { useState, useEffect } from "react";
import AddFeedback from "./AddFeedback";

import "./Feedback.css";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]); // Store feedbacks from the API
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch feedbacks from the server
    fetch("http://localhost:5296/api/feedbacks/GetAllFeedbacks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        return response.json();
      })
      .then((data) => {
        setFeedbacks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []); // Fetch feedbacks once when the component mounts

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
            feedbacks.filter(
              (feedback) => feedback.feedbackId !== feedbackId
            )
          );
          alert("Feedback deleted successfully!");
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert(error.message);
        });
    }
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
          {feedbacks.map((feedback) => (
            <div key={feedback.feedbackId} className="feedback-item">
              <p>User ID: {feedback.userId}</p>
              <p>Message: {feedback.message}</p>
              <p>Date Time: {new Date(feedback.dateTime).toLocaleString()}</p>
              <button onClick={() => handleDelete(feedback.feedbackId)}>
                Delete
              </button>
            </div>
          ))}
          <button onClick={() => setShowAddForm(true)}>Add New Feedback</button>
        </>
      )}
    </div>
  );
}
