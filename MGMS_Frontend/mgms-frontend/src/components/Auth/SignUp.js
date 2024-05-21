import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendFetchRequest } from "../Utils/Utils";
import "./AuthForms.css";

// Handle user registration and sign up
export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    Role: "USER", // Default role set to User
  });

  const [, setIsLoading] = useState(false); // Loading state for form submission requests
  const [success, setSuccess] = useState(false); // Success state for successful form submissions
  const navigate = useNavigate(); // Redirect the user to the login page after successful registration

  // Handle form input changes (controlled component)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setSuccess(false); // Reset previous success state

    // Update the requestData to match the updated backend requirements
    const requestData = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Username: formData.username,
      Email: formData.email,
      Password: formData.password,
      Phone: formData.phone,
      Role: "USER", // By default
    };

    // Send the POST request to the backend
    const response = await sendFetchRequest(
      "auth/Register",
      "POST",
      setIsLoading,
      undefined,
      undefined,
      requestData,
      true
    );

    // Handle the response from the backend
    if (response && response.message) {
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 seconds delay
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>

      {success && (
        <p className="success-message">
          Registration successful! Redirecting...
        </p>
      )}
    </div>
  );
}
