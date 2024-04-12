import React, { useState, useEffect } from "react";
import AddParkingSpot from "./AddParkingSpot";
import UpdateParkingSpot from "./UpdateParkingSpot";

import "./ParkingSpots.css";

export default function ParkingSpots() {
  const [parkingSpots, setParkingSpots] = useState([]); // Store parking spots from the API
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [selectedSpot, setSelectedSpot] = useState(null); // Store selected spot for updating
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Show/hide the update form
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm && !showUpdateForm) {
      // Fetch only if no forms are displayed
      fetch("http://localhost:5296/api/parkingspots/GetAllParkingSpots", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch parking spots");
          }
          return response.json();
        })
        .then((data) => {
          setParkingSpots(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching parking spots:", error);
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [showAddForm, showUpdateForm]); // Re-fetch parking spots only when the form is closed

  // Handle the success of adding a new parking spot
  const handleAddSuccess = (newSpot) => {
    setParkingSpots([...parkingSpots, newSpot]); // Add the new spot to the list
    setShowAddForm(false); // Close the add form
  };

  // Handle the success of updating a parking spot
  const handleUpdateSuccess = (updatedSpot) => {
    const updatedSpots = parkingSpots.map((spot) =>
      spot.parkingSpotId === updatedSpot.parkingSpotId ? updatedSpot : spot
    );
    setParkingSpots(updatedSpots);
    setShowUpdateForm(false);
  };

  // Delete a parking spot by ID and update the list
  const handleDelete = (parkingSpotId) => {
    // Attempt to delete the parking spot from the server
    fetch(
      `http://localhost:5296/api/parkingspots/DeleteParkingSpot?parkingSpotId=${parkingSpotId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
      .then((response) => {
        if (!response.ok) {
          // If the user is not authorized or the server responds with an error
          if (response.status === 403) {
            throw new Error(
              "You do not have permission to delete parking spots."
            );
          }
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to delete parking spot.");
          });
        }
        return response.json(); // Might return some success message or empty
      })
      .then(() => {
        // Only ask for confirmation if the user is authorized and server responded okay
        if (
          window.confirm("Are you sure you want to delete this parking spot?")
        ) {
          setParkingSpots(
            parkingSpots.filter((spot) => spot.parkingSpotId !== parkingSpotId)
          );
          alert("Parking spot deleted successfully!");
        }
      })
      .catch((error) => {
        alert(error.message);
        console.error("Delete error:", error);
      });
  };

  if (isLoading) return <div>Loading parking spots...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="parking-spots-container">
      <h1>Parking Spots</h1>
      {showAddForm && (
        <AddParkingSpot
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {showUpdateForm && selectedSpot && (
        <UpdateParkingSpot
          parkingSpotData={selectedSpot} // Pass the selected spot to the update form
          onUpdated={handleUpdateSuccess} // Handle the update success
          onClose={() => setShowUpdateForm(false)} // Close the update form
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {parkingSpots.map((spot) => (
            <li key={spot.parkingSpotId}>
              Spot ID: {spot.parkingSpotId}, Number: {spot.number}, Section:{" "}
              {spot.section}, Status:{" "}
              {spot.isOccupied ? "Occupied" : "Available"}, Size: {spot.size}
              <button
                onClick={() => {
                  console.log("Selected spot for update:", spot); // Debugging line
                  setSelectedSpot(spot); // Set the currently selected spot for updating
                  setShowUpdateForm(true); // Open the update form
                }}
              >
                Update
              </button>
              <button onClick={() => handleDelete(spot.parkingSpotId)}>
                Delete
              </button>
            </li>
          ))}
          <button onClick={() => setShowAddForm(true)}>
            Add New Parking Spot
          </button>
        </>
      )}
    </div>
  );
}
