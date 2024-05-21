import React, { useState, useEffect } from "react";
import { notifyError, notifySuccess, sendFetchRequest } from "../Utils/Utils";

// Add new parking spot or update existing parking spot
export default function AddParkingSpot({
  onAddSuccess,
  onClose,
  parkingSpotData,
}) {
  const [parkingSpot, setParkingSpot] = useState(
    parkingSpotData || {
      number: 0,
      section: "",
      isOccupied: false, // Default value is not occupied
      size: "", // Small, Medium, Large
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(undefined);

  // Display error message if API request fails
  useEffect(() => {
    if (apiError && apiError !== null) {
      notifyError(apiError);
    }
  }, [apiError]);

  // Update the parking spot state with the parking spot data
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = parkingSpotData
      ? `parkingspots/UpdateParkingSpot?parkingSpotId=${parkingSpotData.parkingSpotId}`
      : "parkingspots/AddParkingSpot";

    const response = await sendFetchRequest(
      apiEndpoint,
      parkingSpotData ? "PUT" : "POST",
      setIsLoading,
      setApiError,
      undefined,
      parkingSpot
    );

    if (response && response.message) {
      onAddSuccess();
      notifySuccess(response.message);
    }
  };

  return (
    <div className="container">
      <h2>{parkingSpotData ? "Update Parking Spot" : "Add Parking Spot"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Number:
            <input
              type="number"
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
              value={parkingSpot.section}
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
    </div>
  );
}
