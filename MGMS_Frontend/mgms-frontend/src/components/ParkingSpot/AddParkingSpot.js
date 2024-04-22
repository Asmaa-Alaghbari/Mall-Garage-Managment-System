import React, { useState, useEffect } from "react";

export default function AddParkingSpot({
  onAddSuccess,
  onClose,
  parkingSpotData,
}) {
  const [parkingSpot, setParkingSpot] = useState(
    parkingSpotData || {
      number: "",
      section: "",
      isOccupied: false, // Default value is not occupied
      size: "", // Small, Medium, Large
    }
  );
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

    // Set size based on selected section
    if (name === "section") {
      let size = "";
      switch (value) {
        case "Compact Cars":
        case "Motorcycles":
          size = "Small";
          break;
        case "Standard Cars":
          size = "Medium";
          break;
        case "Large Vehicles":
        case "Disabled Parking":
          size = "Large";
          break;
        default:
          break;
      }
      setParkingSpot((prev) => ({ ...prev, size }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiUrl = parkingSpotData
      ? `http://localhost:5296/api/parkingspots/UpdateParkingSpot?parkingSpotId=${parkingSpotData.parkingSpotId}`
      : "http://localhost:5296/api/parkingspots/AddParkingSpot";

    fetch(apiUrl, {
      method: parkingSpotData ? "PUT" : "POST",
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
        setMessage(
          `Parking spot ${parkingSpotData ? "updated" : "added"} successfully!`
        );
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
    <div className="container">
      <h2>{parkingSpotData ? "Update Parking Spot" : "Add Parking Spot"}</h2>
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
            <select
              name="section"
              value={parkingSpot.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Section</option>
              <option value="Compact Cars">Compact Cars</option>
              <option value="Standard Cars">Standard Cars</option>
              <option value="Large Vehicles">Large Vehicles</option>
              <option value="Motorcycles">Motorcycles</option>
              <option value="Disabled Parking">Disabled Parking</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Size:
            <input
              type="radio"
              name="size"
              value="Small"
              checked={parkingSpot.size === "Small"}
              onChange={handleChange}
              disabled
            />
            Small
            <input
              type="radio"
              name="size"
              value="Medium"
              checked={parkingSpot.size === "Medium"}
              onChange={handleChange}
              disabled
            />
            Medium
            <input
              type="radio"
              name="size"
              value="Large"
              checked={parkingSpot.size === "Large"}
              onChange={handleChange}
            />
            Large
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
            {parkingSpotData ? "Update" : "Add"}
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
