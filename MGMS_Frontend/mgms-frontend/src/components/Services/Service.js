import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import AddService from "./AddService";
import {
  calculateIndex,
  fetchCurrentUser,
  highlightText,
  notifySuccess,
  pagination,
  sendFetchRequest,
  ShowMessageModel,
} from "../Utils/Utils";
import "../Utils/style.css";

export default function Service() {
  const [services, setServices] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [userRole, setUserRole] = useState("USER");
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchFormData, setSearchFormData] = useState({
    text: "",
    sortByProperty: "",
  });
  const itemsPerPage = 5;

  // Fetch services and current user on component mount
  useEffect(() => {
    fetchServices();
    fetchCurrentUser(undefined, setIsLoading, undefined, setUserRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]);

  // Update the services and total pages when paginated data changes
  useEffect(() => {
    if (paginatedData) {
      setServices(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [paginatedData]);

  // Fetch services from the API
  const fetchServices = async () => {
    await sendFetchRequest(
      `services/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      undefined,
      setPaginatedData,
      searchFormData
    );
  };

  // Handle successful service addition
  const handleAddServiceSuccess = () => {
    fetchServices();
    setShowUpdateForm(false);
    setShowAddForm(false);
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    setSearchFormData((prevSearchFormData) => ({
      ...prevSearchFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle service deletion
  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await sendFetchRequest(
        `services/DeleteService/?serviceId=${serviceId}`,
        "DELETE",
        setIsLoading,
        undefined
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchServices();
      }
    }
  };

  // Show a modal with the given message
  const handleShowMessage = (message) => {
    setModalMessage(message); // Set the message to be displayed in the modal
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="container">
      <h1>Services</h1>

      {showAddForm && (
        <AddService
          onAddSuccess={() => handleAddServiceSuccess(false)}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Show the update form if a spot is selected */}
      {showUpdateForm && selectedService && (
        <AddService
          serviceData={selectedService}
          onAddSuccess={() => handleAddServiceSuccess(false)}
          onClose={() => setShowUpdateForm(false)}
        />
      )}

      {!showAddForm && !showUpdateForm && (
        <div>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchFormData.text}
              name="text"
              onChange={handleSearchInputChange}
              style={{ width: 400 }}
            />

            <select
              value={searchFormData.sortByProperty}
              onChange={handleSearchInputChange}
              name="sortByProperty"
              style={{ width: 400 }}
            >
              <option value="">Sort by...</option>
              <option value="ServiceId">Service ID</option>
              <option value="Name">Name</option>
              <option value="Price">Price</option>
            </select>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Service ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                {userRole === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
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
              {!isLoading &&
                services &&
                services.map((service, index) => (
                  <tr key={service.serviceId}>
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
                    <td>
                      {highlightText(
                        (service.serviceId ?? "").toString(),
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(service.name ?? "", searchFormData.text)}
                    </td>
                    <td>
                      $
                      {highlightText(
                        (service.price ?? "").toString(),
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        <button
                          onClick={() =>
                            handleShowMessage(
                              service.description ?? "",
                              searchFormData.text
                            )
                          }
                        >
                          Show Description
                        </button>
                      )}
                    </td>

                    {userRole === "ADMIN" && (
                      <td>
                        <button
                          onClick={() => {
                            setSelectedService(service);
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
                          onClick={() => handleDelete(service.serviceId)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination">
            {pagination(totalPages, currentPage, handlePageChange)}
          </div>

          {userRole === "ADMIN" && (
            <button onClick={() => setShowAddForm(true)}>
              Add New Service
            </button>
          )}
        </div>
      )}

      {/* Modal to display feedback message */}
      <ShowMessageModel isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h4>Service Description</h4>
        <p>{modalMessage}</p>
      </ShowMessageModel>
    </div>
  );
}
