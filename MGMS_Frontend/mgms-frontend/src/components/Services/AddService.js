import React, { useState, useEffect } from "react";
import { notifyError, notifySuccess, sendFetchRequest } from "../Utils/Utils";
import "../Utils/AddStyle.css";

// Add new service or update existing service
export default function AddService({ onAddSuccess, onClose, serviceData }) {
  const [service, setService] = useState(
    serviceData || {
      name: "",
      description: "",
      price: 0, // Default value is not occupied
    }
  );
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Notify user of any errors
  useEffect(() => {
    if (error && error !== null) {
      if (!error.message) {
        notifyError("Failed to fetch from server!");
      } else {
        notifyError(error.message);
      }
    }
  }, [error]);

  // Update the state when the form input changes
  const handleChange = (e) => {
    setService((prevSearchFormData) => ({
      ...prevSearchFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = serviceData
      ? `services/UpdateService?serviceId=${serviceData.serviceId}`
      : "services/AddService";

    const response = await sendFetchRequest(
      apiEndpoint,
      serviceData ? "PUT" : "POST",
      setIsLoading,
      setError,
      undefined,
      service
    );

    console.log("Response:", response);

    if (!error && response && response.message) {
      onAddSuccess();
      notifySuccess(response.message);
    }
  };

  return (
    <div className="general-container">
      <h2>{serviceData ? "Update Service" : "Add Service"}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={service.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={service.description}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {serviceData ? "Update" : "Add"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
