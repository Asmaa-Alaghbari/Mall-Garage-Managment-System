import React, { useState, useEffect } from "react";
import {
  fetchCurrentUser,
  sendFetchRequest,
  notifyError,
  notifySuccess,
} from "../Utils/Utils";
import "../Utils/AddStyle.css";

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
    <div className="general-container">
      <h2>{paymentData ? "Update Payment" : "Add Payment"}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Reservation ID:</label>
          <input
            type="text"
            name="reservationId"
            value={payment.reservationId}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <input
          type="text"
          name="userId"
          value={payment.userId}
          onChange={handleChange}
          required
          readOnly
          hidden
          className="input-field"
        />
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            min={0}
            value={payment.amount}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={payment.paymentMethod}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select a payment method</option>
            <option value="credit card">Credit Card</option>
            <option value="debit card">Debit Card</option>
            <option value="paypal">Paypal</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div className="form-actions">
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
