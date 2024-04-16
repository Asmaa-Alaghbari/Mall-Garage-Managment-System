import React, { useState, useEffect } from "react";

export default function AddFeedback({ onAddSuccess, onClose }) {
  const [feedback, setFeedback] = useState({
    userId: "",
    msg: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    fetch("http://localhost:5296/api/feedbacks/AddFeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(feedback),
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
        setMessage(error.message);
        setIsLoading(false);
      });
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
        <div>
          <label>
            Message:
            <textarea
              name="message"
              value={feedback.msg}
              onChange={handleChange}
              required
            />
          </label>
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
      {message && <p className="message-success">{message}</p>}
    </div>
  );
}
