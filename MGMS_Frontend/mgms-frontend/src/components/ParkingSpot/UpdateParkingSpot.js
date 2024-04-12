import React, { useState, useEffect } from "react";

export default function UpdateParkingSpot({
  parkingSpotData, // Existing parking spot data to pre-fill the form
  onUpdated, // Callback function to notify the parent component about the update
  onClose, // Callback function to close the form
}) {
  const [parkingSpot, setParkingSpot] = useState({
    parkingSpotId: "",
    number: "",
    section: "",
    isOccupied: false,
    size: "",
  });

  // Pre-fill form when component receives parkingSpotData
  useEffect(() => {
    console.log("Received new parking spot data for form:", parkingSpotData); // Debugging line
    if (parkingSpotData) {
      setParkingSpot({
        parkingSpotId: parkingSpotData.parkingSpotId,
        number: parkingSpotData.number,
        section: parkingSpotData.section,
        isOccupied: parkingSpotData.isOccupied,
        size: parkingSpotData.size,
      });
    }
  }, [parkingSpotData]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParkingSpot((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if data was modified
    const isModified =
      parkingSpotData.number !== parkingSpot.number ||
      parkingSpotData.section !== parkingSpot.section ||
      parkingSpotData.isOccupied !== parkingSpot.isOccupied ||
      parkingSpotData.size !== parkingSpot.size;

    if (!isModified) {
      setMessage("No modifications were made!");
      return; // Exit the function early if no changes were detected
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5296/api/parkingspots/UpdateParkingSpot?parkingSpotId=${parkingSpot.parkingSpotId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(parkingSpot),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update the parking spot");
      } else {
        const updatedData = await response.json();
        setMessage("Parking spot updated successfully!");

        // Delay closing the form to show the success message
        setTimeout(() => {
          onUpdated(updatedData); // Notify parent component about the update
          onClose(); // Close the form after a delay
        }, 3000); // 3 seconds delay
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Parking Spot</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Parking Spot ID:
          <input
            type="text"
            name="parkingSpotId"
            value={parkingSpot.parkingSpotId}
            onChange={handleChange}
            readOnly // ID should not be editable
          />
        </label>
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
        <label>
          Section:
          <input
            type="text"
            name="section"
            value={parkingSpot.section}
            onChange={handleChange}
          />
        </label>
        <label>
          Size:
          <input
            type="text"
            name="size"
            value={parkingSpot.size}
            onChange={handleChange}
          />
          <label>
            Occupied:
            <input
              type="checkbox"
              name="isOccupied"
              checked={parkingSpot.isOccupied}
              onChange={handleChange}
            />
          </label>
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
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
