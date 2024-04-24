import React, { useState, useEffect } from "react";
import { fetchCurrentUser } from "../Utils";

export default function AddPayment({
  onAddSuccess,
  onClose,
  paymentData,
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
    fetchCurrentUser(setPayment, setIsLoading, setError, () => {});
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
