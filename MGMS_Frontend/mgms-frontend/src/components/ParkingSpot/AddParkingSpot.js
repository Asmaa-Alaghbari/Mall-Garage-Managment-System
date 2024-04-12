import React, { useState, useEffect } from "react";

export default function AddParkingSpot({ onAddSuccess, onClose }) {
  const [parkingSpot, setParkingSpot] = useState({
    number: "",
    section: "",
    isOccupied: false, // Default value for checkbox
    size: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Close the form after showing the success message
  useEffect(() => {
    if (message === "Parking spot added successfully!") {
      const timer = setTimeout(() => {
        onClose(); // Close the form automatically after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setParkingSpot((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://localhost:5296/api/parkingspots/AddParkingSpot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(parkingSpot),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle different types of errors based on status codes
          if (response.status === 403) {
            throw new Error("You do not have permission to add parking spots.");
          }
          return response.json().then((data) => {
            // Handle custom error messages from the API
            throw new Error(data.message || "Failed to add parking spot.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Parking spot added successfully!");
        onAddSuccess(data); // Update the list of parking spots
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
      <h2>Add Parking Spot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Number:
            <input
              type="text"
              name="number"
              value={parkingSpot.number}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Section:
            <input
              type="text"
              name="section"
              value={parkingSpot.section}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Size:
            <input
              type="text"
              name="size"
              value={parkingSpot.size}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Occupied:
            <input
              type="checkbox"
              name="isOccupied"
              checked={parkingSpot.isOccupied}
              onChange={handleChange}
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
