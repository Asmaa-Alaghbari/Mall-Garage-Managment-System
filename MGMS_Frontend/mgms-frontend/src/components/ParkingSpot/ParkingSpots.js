import React, { useState, useEffect, useRef } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaExpand,
  FaSearchPlus,
  FaSearchMinus,
  FaUndoAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import AddParkingSpot from "./AddParkingSpot";
import ParkingSpotMap from "./ParkingSpotMap.svg";
import {
  calculateIndex,
  fetchCurrentUser,
  highlightText,
  notifyError,
  notifySuccess,
  pagination,
  sendFetchRequest,
} from "../Utils/Utils";
import "./ParkingSpotMap.css";

export default function ParkingSpots() {
  const [parkingSpots, setParkingSpots] = useState([]); // Store parking spots from the API
  const [paginatedData, setPaginatedData] = useState(); // Store parking spots from the API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("USER");
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(5); // Number of items per page for pagination
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Show/hide the update form
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [selectedSpot, setSelectedSpot] = useState(null); // Set selected spot
  const [totalPages, setTotalPages] = useState(0); // Total number of pages for pagination
  const [currentView, setCurrentView] = useState("table"); // Manage the current view
  const [searchFormData, setSearchFormData] = useState({
    text: "",
    status: "",
    size: "",
    section: "",
    sortByProperty: "",
  });
  const mapContainerRef = useRef(null); // Reference for the map container

  // Fetch parking spots and current user on component mount
  useEffect(() => {
    const fetchData = () => {
      fetchParkingSpots();
      fetchCurrentUser(undefined, setIsLoading, setError, setUserRole);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]); // Re-fetch parking spots only when the form is closed

  // Update the parking spots state with the paginated data
  useEffect(() => {
    if (error && error != null) {
      notifyError(error);
    }

    if (paginatedData) {
      setParkingSpots(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [error, paginatedData]);

  // Fetch parking spots from the API
  const fetchParkingSpots = async () => {
    await sendFetchRequest(
      `parkingspots/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      setError,
      setPaginatedData,
      searchFormData
    );
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    setSearchFormData((prevSearchFormData) => ({
      ...prevSearchFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Delete a parking spot
  const handleDelete = async (parkingSpotId) => {
    if (window.confirm("Are you sure you want to delete this parking spot?")) {
      const response = await sendFetchRequest(
        `parkingspots/DeleteParkingSpot/?parkingSpotId=${parkingSpotId}`,
        "DELETE",
        setIsLoading,
        setError
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchParkingSpots();
      }
    }
  };

  // Handle add parking spot success
  const handleAddParkingSpotSuccess = () => {
    fetchParkingSpots();
    setShowUpdateForm(false);
    setShowAddForm(false);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle fullscreen button click for the map view
  const handleFullscreen = () => {
    const elem = mapContainerRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
  };

  return (
    <div className="container">
      <h1>Parking Spots</h1>

      {showAddForm && (
        <AddParkingSpot
          onAddSuccess={() => handleAddParkingSpotSuccess()}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Show the update form if a spot is selected */}
      {showUpdateForm && selectedSpot && (
        <AddParkingSpot
          parkingSpotData={selectedSpot} // Pass the selected spot data
          onAddSuccess={() => handleAddParkingSpotSuccess()} // Use handleUpdateSuccess for updates
          onClose={() => setShowUpdateForm(false)} // Close the form
        />
      )}

      {/* Search filter and table view */}
      {!showAddForm && !showUpdateForm && currentView === "table" && (
        <div>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchFormData.text}
              name="text"
              onChange={handleSearchInputChange}
            />

            {/* Filter by status  */}
            <select
              value={searchFormData.status}
              onChange={handleSearchInputChange}
              name="status"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>

            {/* Filter by section */}
            <select
              value={searchFormData.section}
              onChange={handleSearchInputChange}
              name="section"
            >
              <option value="all">All Section</option>
              <option value="Compact Cars">Compact Cars</option>
              <option value="Disabled Parking">Disabled Parking</option>
              <option value="Large Vehicles">Large Vehicles</option>
              <option value="Motorcycles">Motorcycles</option>
              <option value="Standard Cars">Standard Cars</option>
            </select>

            {/* Filter by size */}
            <select
              value={searchFormData.size}
              onChange={handleSearchInputChange}
              name="size"
            >
              <option value="all">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <select
              value={searchFormData.sortByProperty}
              onChange={handleSearchInputChange}
              name="sortByProperty"
            >
              <option value="">Sort by...</option>
              <option value="ParkingSpotNumber">PS Number</option>
              <option value="Section">Section</option>
              <option value="Size">Size</option>
            </select>
          </div>

          {/* Display the parking spots in a table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                {userRole === "ADMIN" && <th>Spot ID</th>}
                <th>PS Number</th>
                <th>Section</th>
                <th>Status</th>
                <th>Size</th>
                {userRole === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {/* Display loading spinner when fetching data from the API */}
              {isLoading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: "40px",
                      }}
                    >
                      <BeatLoader
                        color="#000000"
                        loading={isLoading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </td>
                </tr>
              )}

              {/* Display parking spots */}
              {!isLoading &&
                parkingSpots &&
                parkingSpots
                  .slice()
                  .sort((a, b) => a.number - b.number) // Sort by the "number" property
                  .map((spot, index) => (
                    <tr key={spot.parkingSpotId}>
                      <td>
                        {highlightText(
                          calculateIndex(
                            index,
                            currentPage,
                            itemsPerPage
                          ).toString(),
                          searchFormData.text
                        )}
                      </td>
                      {userRole === "ADMIN" && (
                        <td>
                          {highlightText(
                            (spot.parkingSpotId ?? "").toString(),
                            searchFormData.text
                          )}
                        </td>
                      )}
                      <td>
                        {highlightText(
                          (spot.parkingSpotNumber ?? "").toString(),
                          searchFormData.text
                        )}
                      </td>
                      <td>
                        {highlightText(spot.section ?? "", searchFormData.text)}
                      </td>
                      <td>
                        {highlightText(
                          spot.isOccupied ? "Occupied" : "Available",
                          searchFormData.text
                        )}
                      </td>
                      <td>
                        {highlightText(spot.size ?? "", searchFormData.text)}
                      </td>

                      {userRole === "ADMIN" && (
                        <td>
                          <button
                            onClick={() => {
                              setSelectedSpot(spot);
                              setShowUpdateForm(true);
                            }}
                            style={{
                              marginRight: "10px",
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(spot.parkingSpotId)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {pagination(totalPages, currentPage, handlePageChange)}
          </div>

          {/* Add New Parking Spot */}
          {userRole === "ADMIN" && (
            <button onClick={() => setShowAddForm(true)}>
              Add New Parking Spot
            </button>
          )}
        </div>
      )}

      {/* View toggle button */}
      {!showAddForm && !showUpdateForm && (
        <div className="view-toggle-button">
          <button
            style={{ backgroundColor: "#4CAF50", color: "white" }}
            onClick={() =>
              setCurrentView(currentView === "table" ? "map" : "table")
            }
          >
            {currentView === "table" ? "Map View" : "Table View"}
          </button>
        </div>
      )}

      {/* Display the map view when the current view is "map" */}
      {currentView === "map" && !showAddForm && !showUpdateForm && (
        <div className="map-view">
          <div className="map-container" ref={mapContainerRef}>
            <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <>
                  <div className="tools">
                    <button
                      onClick={handleFullscreen}
                      title="Fullscreen"
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      <FaExpand size={15} />
                    </button>
                    <button
                      onClick={() => zoomIn()}
                      title="Zoom In"
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      <FaSearchPlus size={15} />
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      title="Zoom Out"
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      <FaSearchMinus size={15} />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      title="Reset"
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      <FaUndoAlt size={15} />
                    </button>
                    <button
                      data-tooltip-id="mapDetailsTooltip"
                      title="Map Details"
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      <FaInfoCircle size={15} />
                    </button>
                    <ReactTooltip
                      id="mapDetailsTooltip"
                      place="right"
                      effect="solid"
                    >
                      <div>
                        <p>C: Compact Cars (400x600cm) - Small</p>
                        <p>M: Motorcycles (400x600cm) - Small</p>
                        <p>S: Standard Cars (600x1000cm) - Medium</p>
                        <p>D: Disabled Parking (800x1200cm) - Large</p>
                        <p>L: Large Vehicles (800x1200cm) - Large</p>
                      </div>
                    </ReactTooltip>
                  </div>

                  {/* Display the map image */}
                  <TransformComponent>
                    <img
                      src={ParkingSpotMap}
                      alt="Parking Spot Map"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
}

