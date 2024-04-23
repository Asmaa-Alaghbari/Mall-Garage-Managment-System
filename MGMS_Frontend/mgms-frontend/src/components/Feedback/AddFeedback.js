import React, { useState, useEffect } from "react";
import { fetchCurrentUser } from "../../Utils";

export default function AddFeedback({ onAddSuccess, onClose }) {
  const [feedback, setFeedback] = useState({
    userId: "",
    rating: 5, // default value
    feedbackType: "General", // default value
    isAnonymous: false, // default value
    feedbackMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Destructure the event target

    setFeedback((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update the feedback state based on the input type
    }));
  };

  // Fetch the current user data from the backend
  useEffect(() => {
    const loadData = async () => {
      await fetchCurrentUser(setFeedback, setIsLoading, setError);
    };

    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!feedback.feedbackMessage.trim()) {
      setError("Message field cannot be empty.");
      return;
    }

    // Map feedbackMessage to Message
    const updatedFeedback = {
      ...feedback,
      Message: feedback.feedbackMessage,
    };

    fetch("http://localhost:5296/api/feedbacks/AddFeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedFeedback),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to add feedback.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Feedback added successfully!");
        onAddSuccess(data); // Update the list of feedbacks
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.errors && error.errors.Message) {
          setMessage(`Message: ${error.errors.Message.join(", ")}`);
        } else {
          setMessage(error.message);
        }
        setIsLoading(false);
      });
  };

  // Update the rating value in the feedback state
  const handleRatingChange = (ratingValue) => {
    setFeedback((prev) => ({
      ...prev,
      rating: ratingValue,
    }));
  };

  return (
    <div className="container">
      <h2>Add Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="number"
            name="userId"
            value={feedback.userId}
            onChange={handleChange}
            required
            readOnly
            hidden
          />
        </div>
        <div className="rating-cosntainer">
          <label>
            Rating:
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    checked={ratingValue === feedback.rating}
                    onChange={() => handleRatingChange(ratingValue)}
                    style={{ display: "none" }}
                  />
                  <i
                    className={`star-icon ${
                      ratingValue <= feedback.rating
                        ? "fas fa-star"
                        : "far fa-star"
                    }`}
                  ></i>
                </label>
              );
            })}
          </label>
        </div>
        <div className="feedback-radio-container">
          <label>
            Feedback Type:
            <span className="radio-container">
              General
              <input
                type="radio"
                name="feedbackType"
                value="General"
                onChange={handleChange}
                checked={feedback.feedbackType === "General"}
              />
              Bug Report
              <input
                type="radio"
                name="feedbackType"
                value="Bug Report"
                onChange={handleChange}
                checked={feedback.feedbackType === "Bug Report"}
              />
              Feature Request
              <input
                type="radio"
                name="feedbackType"
                value="Feature Request"
                onChange={handleChange}
                checked={feedback.feedbackType === "Feature Request"}
              />
            </span>
          </label>
        </div>
        <div className="msg-container">
          <label className="msg-textarea">Message:</label>
          <textarea
            name="feedbackMessage"
            value={feedback.feedbackMessage}
            onChange={handleChange}
          />
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            name="isAnonymous"
            id="isAnonymous"
            checked={feedback.isAnonymous}
            onChange={handleChange}
          />
          <label htmlFor="isAnonymous">anonymous sender</label>
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
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
