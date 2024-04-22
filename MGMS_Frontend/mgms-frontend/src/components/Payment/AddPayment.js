import React, { useState, useEffect } from "react";

export default function AddPayment({
  onAddSuccess,
  onClose,
  paymentData,
  paymentId,
}) {
  const [payment, setPayment] = useState(
    paymentData || {
      paymentId: "",
      reservationId: "",
      userId: "",
      amount: "",
      paymentMethod: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [, setError] = useState(null);

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

        // Set the paymentId when updating a payment
        if (paymentId) {
          setPayment((prev) => ({
            ...prev,
            paymentId: paymentId, // Set the paymentId
          }));
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [paymentId]);

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

    // Prepare the payment data to be sent to the backend
    const paymentData = {
      paymentId: payment.paymentId, // Keep as string
      reservationId: parseInt(payment.reservationId, 10), // Convert to number, base 10
      userId: parseInt(payment.userId, 10), // Convert to number, base 10
      amount: parseFloat(payment.amount), // Convert to float
      paymentMethod: payment.paymentMethod, // Keep as string
      dateTime: new Date().toISOString(), // Add current date and time
    };

    const apiUrl = paymentData.paymentId
      ? `http://localhost:5296/api/Payments/UpdatePayment?paymentId=${paymentData.paymentId}`
      : "http://localhost:5296/api/Payments/AddPayment";

    const fetchMethod = paymentData.paymentId ? "PUT" : "POST";

    fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            paymentData.paymentId
              ? "Failed to update payment"
              : "Failed to add payment"
          );
        }
        return response.json();
      })
      .then((data) => {
        setMessage(
          paymentData.paymentId
            ? "Payment updated successfully!"
            : "Payment added successfully!"
        );
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
    <div className="container">
      <h2>{paymentData ? "Update Payment" : "Add Payment"}</h2>
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
            min={0}
            value={payment.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Payment Method:
          <select
            name="paymentMethod"
            value={payment.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="credit card">Credit Card</option>
            <option value="debit card">Debit Card</option>
            <option value="paypal">Paypal</option>
            <option value="cash">Cash</option>
          </select>
        </label>
        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? paymentData
                ? "Updating..."
                : "Adding..."
              : paymentData
              ? "Update Payment"
              : "Add Payment"}
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
