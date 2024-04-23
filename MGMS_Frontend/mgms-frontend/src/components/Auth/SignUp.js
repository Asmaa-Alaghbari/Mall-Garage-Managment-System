import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

// Handle user registration
export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "", // Optional
  });

  const [, setIsLoading] = useState(false); // Loading state for form submission requests
  const [, setError] = useState(""); // Error state for form submission errors
  const [, setSuccess] = useState(false); // Success state for successful form submissions
  const navigate = useNavigate(); // Redirect the user to the login page after successful registration

  // Handle form input changes (controlled component)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (POST request) to the API server (backend)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading
    setError(""); // Reset previous errors
    setSuccess(false); // Reset previous success state

    // Update the requestData to match the updated backend requirements
    const requestData = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Username: formData.username,
      Email: formData.email,
      Password: formData.password,
      Phone: formData.phone,
      Role: "User", // By default
    };

    // Add the optional address field if it's not empty
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      credentials: "include", // Include cookies in the requests
    };

    try {
      // Make a POST request to the API server (backend)
      const apiURL = "http://localhost:5296/api/auth/Register"; // API URL for user registration

      const response = await fetch(apiURL, requestOptions);

      if (!response.ok) {
        const errorData = await response.text(); // Use .text() first
        try {
          const jsonError = JSON.parse(errorData); // Try to parse JSON
          setError(jsonError.message || "Registration failed!");
        } catch {
          setError("An unexpected error occurred.");
        }
      } else {
        setSuccess(true);
        // Redirect to login page after a short delay to show the success message
        setTimeout(() => {
          navigate("/login");
        }, 500); // 0.5 seconds

        console.log("Registration successful!");
        // Proceed with user registration success flow
      }
    } catch (error) {
      console.error("There was an error!", error);
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
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
