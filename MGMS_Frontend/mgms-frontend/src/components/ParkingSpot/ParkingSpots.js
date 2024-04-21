import React, { useState, useEffect } from "react";
import AddParkingSpot from "./AddParkingSpot";
import UpdateParkingSpot from "./UpdateParkingSpot";
import "./ParkingSpots.css";

export default function ParkingSpots() {
  const [parkingSpots, setParkingSpots] = useState([]); // Store parking spots from the API
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [selectedSpot, setSelectedSpot] = useState(null); // Store selected spot for updating
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Show/hide the update form
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(10); // Number of items per page for pagination
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [statusFilter, setStatusFilter] = useState("all"); // Filter by status
  const [sizeFilter, setSizeFilter] = useState("all"); // Filter by size
  const [sortType, setSortType] = useState("parkingSpotId"); // Sort by parking spot ID by default
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm && !showUpdateForm) {
      fetchParkingSpots();
    }
  }, [showAddForm, showUpdateForm]); // Re-fetch parking spots only when the form is closed

  // Fetch parking spots from the server
  const fetchParkingSpots = () => {
    setIsLoading(true);
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
  };

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

  // Handle the change in the current page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle the change in the search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle the change in the status filter
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle the change in the size filter
  const handleSizeChange = (e) => {
    setSizeFilter(e.target.value);
  };

  // Filter parking spots based on search term (case-insensitive)
  const filteredParkingSpots = parkingSpots.filter((spot) => {
    return (
      spot.parkingSpotId.toString().includes(searchTerm) ||
      spot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (spot.isOccupied ? "Occupied" : "Available")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      spot.size.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter parking spots based on status and size
  const filteredAndSortedParkingSpots = filteredParkingSpots
    .filter((spot) => {
      if (statusFilter === "all") return true;
      return spot.isOccupied === (statusFilter === "occupied");
    })
    .filter((spot) => {
      if (sizeFilter === "all") return true;
      return spot.size === sizeFilter;
    });

  // Sort the parking spots based on the sort type
  let sortedParkingSpots = [...filteredAndSortedParkingSpots];

  const sortFunctions = {
    number: (a, b) => a.number - b.number,
    section: (a, b) => a.section.localeCompare(b.section),
    status: (a, b) =>
      a.isOccupied === b.isOccupied ? 0 : a.isOccupied ? -1 : 1,
    size: (a, b) => a.size.localeCompare(b.size),
  };

  // Sort the parking spots based on the sort type
  if (sortType && sortFunctions[sortType]) {
    sortedParkingSpots = sortedParkingSpots.sort(sortFunctions[sortType]);
  }

  const totalPages = Math.ceil(
    filteredAndSortedParkingSpots.length / itemsPerPage
  );

  // Slice the parkingSpots array based on currentPage and itemsPerPage
  const paginate = (array, page_number, page_size) => {
    const startIndex = (page_number - 1) * page_size;
    const endIndex = startIndex + page_size;
    return array.slice(startIndex, endIndex);
  };

  // Paginated parking spots based on currentPage and itemsPerPage
  const paginatedParkingSpots = paginate(
    sortedParkingSpots,
    currentPage,
    itemsPerPage
  );

  // Highlight the search term in the text
  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (isLoading) return <div>Loading parking spots...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="parking-spots-container">
      <h1>Parking Spots</h1>

      {/* Add and Update forms */}
      {showAddForm && (
        <AddParkingSpot
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Show the update form if a spot is selected */}
      {showUpdateForm && selectedSpot && (
        <UpdateParkingSpot
          parkingSpotData={selectedSpot} // Pass the selected spot to the update form
          onUpdated={handleUpdateSuccess} // Handle the update success
          onClose={() => setShowUpdateForm(false)} // Close the update form
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {/* Search and Filters */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="available">Available</option>
            </select>
            <select value={sizeFilter} onChange={handleSizeChange}>
              <option value="all">All Sizes</option>
              <option value="Compact Cars">Compact Cars</option>
              <option value="Standard Cars">Standard Cars</option>
              <option value="Large Vehicles">Large Vehicles</option>
              <option value="Motorcycles">Motorcycles</option>
              <option value="Disabled Parking">Disabled Parking</option>
            </select>
            {/*  Sort by number, section, status, size */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="number">Number</option>
              <option value="section">Section</option>
              <option value="status">Status</option>
              <option value="size">Size</option>
            </select>
          </div>

          {/* Table */}
          <table className="parking-spots-table">
            <thead>
              <tr>
                <th>Spot ID</th>
                <th>Number</th>
                <th>Section</th>
                <th>Status</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedParkingSpots.map((spot) => (
                <tr key={spot.parkingSpotId}>
                  <td>
                    {highlightText(spot.parkingSpotId.toString(), searchTerm)}
                  </td>
                  <td>{highlightText(spot.number, searchTerm)}</td>
                  <td>{highlightText(spot.section, searchTerm)}</td>
                  <td>
                    {highlightText(
                      spot.isOccupied ? "Occupied" : "Available",
                      searchTerm
                    )}
                  </td>
                  <td>{highlightText(spot.size, searchTerm)}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedSpot(spot);
                        setShowUpdateForm(true);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </button>
                    <button onClick={() => handleDelete(spot.parkingSpotId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              )}
          </div>

          <button onClick={() => setShowAddForm(true)}>
            Add New Parking Spot
          </button>
        </>
      )}
    </div>
  );
}
