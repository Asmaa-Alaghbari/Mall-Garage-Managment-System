import React, { useState, useEffect } from "react";

export default function AddPayment({ onAddSuccess, onClose }) {
  const [payment, setPayment] = useState({
    reservationId: "",
    userId: "",
    amount: "",
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch the user data from the backend using the token for authentication
        const response = await fetch("http://localhost:5296/api/auth/GetUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        // Parse the response body as JSON
        const userData = await response.json();
        console.log("Fetched user data:", userData); // Log the fetched user data

        // Check if the UserId field exists in the userData
        if (userData.userId) {
          setPayment((prev) => ({
            ...prev,
            userId: userData.userId, // Populate userId with the fetched ID
          }));
        } else {
          console.error("UserId not found in user data");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    console.log("Current payment state:", payment);
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting payment data:", payment);
    setIsLoading(true);

    if (!payment.userId || !payment.reservationId) {
      console.error("userId or reservationId is missing:", payment);
      return;
    }

    const paymentData = {
      reservationId: parseInt(payment.reservationId, 10),
      userId: parseInt(payment.userId, 10),
      amount: parseFloat(payment.amount),
      paymentMethod: payment.paymentMethod,
      dateTime: new Date().toISOString(), // Add current date and time
    };

    const createPaymentDto = {
      ...paymentData,
    };

    fetch("http://localhost:5296/api/Payments/AddPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(createPaymentDto),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add payment");
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Payment added successfully!");
        onAddSuccess(data);
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Add Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Reservation ID:
          <input
            type="text"
            name="reservationId"
            value={payment.reservationId}
            onChange={handleChange}
            required
          />
        </label>
        <input
          type="text"
          name="userId"
          value={payment.userId}
          onChange={handleChange}
          required
          readOnly
          hidden
        />
        <label>
          Amount:
          <input 
          type="number" 
          name="amount" 
          value={payment.amount} 
          onChange={handleChange}
          required />
        </label>
        <label>
          Payment Method:
          <input
            type="text"
            name="paymentMethod"
            value={payment.paymentMethod}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Payment"}
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
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
