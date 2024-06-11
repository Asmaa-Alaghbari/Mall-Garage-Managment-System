import React, { useState, useEffect } from "react";
import {
  fetchCurrentUser,
  notifyError,
  notifySuccess,
  sendFetchRequest,
} from "../Utils/Utils";
import "../Utils/AddStyle.css";

export default function AddFeedback({ onAddSuccess, onClose }) {
  const [feedback, setFeedback] = useState({
    userId: 0,
    rating: 5, // default value
    feedbackType: "General", // default value
    isAnonymous: false, // default value
    feedbackMessage: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes (controlled component)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Destructure the event target

    setFeedback((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update the feedback state based on the input type
    }));
  };

  // Fetch the current user data when the component is mounted
  useEffect(() => {
    fetchCurrentUser(setCurrentUser, setIsLoading);
  }, []);

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.feedbackMessage.trim()) {
      notifyError("Message field cannot be empty.");
      return;
    }

    const updatedFeedback = {
      ...feedback,
      Message: feedback.feedbackMessage,
      userId: currentUser.userId,
    };

    const response = await sendFetchRequest(
      "feedbacks/AddFeedback",
      "POST",
      setIsLoading,
      undefined,
      undefined,
      updatedFeedback
    );

    if (response && response.message) {
      onAddSuccess();
      notifySuccess(response.message);
    }
  };

  // Update the rating value in the feedback state
  const handleRatingChange = (ratingValue) => {
    setFeedback((prev) => ({
      ...prev,
      rating: ratingValue,
    }));
  };

  return (
    <div className="general-container">
      <h2>Add Feedback</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="number"
          name="userId"
          value={feedback.userId}
          onChange={handleChange}
          required
          readOnly
          hidden
          className="input-field"
        />
        <div className="form-group">
          <label>
            Rating:
            <div className="rating-container">
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
            </div>
          </label>
        </div>
        <div className="form-group">
          <label>
            Feedback Type:
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="feedbackType"
                  value="General"
                  onChange={handleChange}
                  checked={feedback.feedbackType === "General"}
                />
                General
              </label>
              <label>
                <input
                  type="radio"
                  name="feedbackType"
                  value="Bug Report"
                  onChange={handleChange}
                  checked={feedback.feedbackType === "Bug Report"}
                />
                Bug Report
              </label>
              <label>
                <input
                  type="radio"
                  name="feedbackType"
                  value="Feature Request"
                  onChange={handleChange}
                  checked={feedback.feedbackType === "Feature Request"}
                />
                Feature Request
              </label>
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="msg-textarea">Message:</label>
          <textarea
            name="feedbackMessage"
            value={feedback.feedbackMessage}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Anonymous Sender Checkbox */}
        <div className="form-group checkbox-container">
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="isAnonymous"
              id="isAnonymous"
              checked={feedback.isAnonymous}
              onChange={handleChange}
            />
            <span className="checkbox-custom"></span>
            <span>Anonymous Sender</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
