import React, { useEffect, useState } from "react";

export default function AddUser({ onAddSuccess, onClose, userData }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Close the form after showing the success message
  useEffect(() => {
    if (message === "User added successfully!") {
      const timer = setTimeout(() => {
        onClose(); // Close the form automatically after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("http://localhost:5296/api/auth/AddUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then((data) => {
        setMessage("User added successfully!");
        onAddSuccess(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setMessage(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add User"}
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
