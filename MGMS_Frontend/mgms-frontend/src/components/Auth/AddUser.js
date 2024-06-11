import React, { useState } from "react";
import { sendFetchRequest, notifySuccess } from "../Utils/Utils";
import "../Utils/AddStyle.css";

// Handle adding a new user to the list of users
export default function AddUser({ onAddSuccess, onClose, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(
    userData || {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      role: "USER", // Default role set to User
    }
  );

  // Handle form input changes (controlled component)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await sendFetchRequest(
      "auth/AddUser",
      "POST",
      setIsLoading,
      undefined, // setError
      undefined, // setResponse
      formData
    );

    if (response && response.message) {
      onAddSuccess();
      notifySuccess(response.message);
    }
  };

  return (
    <div className="general-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add User"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
