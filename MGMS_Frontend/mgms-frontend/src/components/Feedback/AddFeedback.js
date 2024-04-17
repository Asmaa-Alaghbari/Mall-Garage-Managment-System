import React, { useState, useEffect } from "react";
import "./Feedback.css";

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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Destructure the event target

    setFeedback((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update the feedback state based on the input type
    }));
  };

  // F`etch the current user data from the backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch the user data from the backend using the token for authentication
        const response = await fetch("http://localhost:5296/api/auth/GetUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        // Parse the response body as JSON
        const userData = await response.json();
        console.log("Fetched user data:", userData); // Log the fetched user data

        // Check if the UserId field exists in the userData
        if (userData.userId) {
          setFeedback((prev) => ({
            ...prev,
            userId: userData.userId, // Populate userId with the fetched ID
          }));
        } else {
          console.error("UserId not found in user data");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
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
    <div>
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
        <div ClassName="rating-cosntainer">
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
              Bug
              <input
                type="radio"
                name="feedbackType"
                value="Bug"
                onChange={handleChange}
                checked={feedback.feedbackType === "Bug"}
              />
              Feature
              <input
                type="radio"
                name="feedbackType"
                value="Feature"
                onChange={handleChange}
                checked={feedback.feedbackType === "Feature"}
              />
            </span>
          </label>
        </div>
        <div>
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
