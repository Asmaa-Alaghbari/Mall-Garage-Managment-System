import React, { useState, useEffect } from "react";
import { notifyError, notifySuccess, sendFetchRequest } from "../Utils/Utils";

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
    <div className="container">
      <h2>{serviceData ? "Update Service" : "Add Service"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={service.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label className="msg-container">
            Description:
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={service.price}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
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
