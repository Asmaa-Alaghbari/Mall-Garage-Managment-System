import React, { useState, useEffect } from "react";
import {
  fetchCurrentUser,
  sendFetchRequest,
  notifyError,
  notifySuccess,
} from "../Utils/Utils";

// Add new payment or update existing payment
export default function AddPayment({ onAddSuccess, onClose, paymentData }) {
  const [payment, setPayment] = useState(
    paymentData || {
      paymentId: 0,
      reservationId: 0,
      userId: 0,
      amount: 0,
      paymentMethod: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch the current user on component mount
  useEffect(() => {
    fetchCurrentUser(setUser, setIsLoading, setError);
  }, []);

  // Update the payment state with the payment data
  useEffect(() => {
    if (error && error !== null) {
      notifyError(error);
    }
  }, [error]);

  // Update the payment state with the payment data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (payment && !payment.userId || !payment.reservationId) {
    // 	notifyError("userId or reservationId is missing!");
    // 	return;
    // }

    // Prepare the payment data to be sent to the backend
    // const paymentData = {
    // 	paymentId: payment.paymentId, // Keep as string
    // 	reservationId: parseInt(payment.reservationId, 10), // Convert to number, base 10
    // 	userId: parseInt(payment.userId, 10), // Convert to number, base 10
    // 	amount: parseFloat(payment.amount), // Convert to float
    // 	paymentMethod: payment.paymentMethod, // Keep as string
    // 	dateTime: new Date().toISOString(), // Add current date and time
    // };

    payment.userId = user.userId;

    const apiEndpoint = paymentData
      ? `Payments/UpdatePayment?paymentId=${paymentData.paymentId}`
      : "Payments/AddPayment";

    const response = await sendFetchRequest(
      apiEndpoint,
      paymentData ? "PUT" : "POST",
      setIsLoading,
      setError,
      undefined,
      payment
    );

    if (response && response.message) {
      onAddSuccess();
      notifySuccess(response.message);
    }
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
    </div>
  );
}
