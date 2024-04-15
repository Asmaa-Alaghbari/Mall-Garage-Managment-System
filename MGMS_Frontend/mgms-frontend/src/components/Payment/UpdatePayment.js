import React, { useState, useEffect } from "react";

export default function UpdatePayment({ paymentData, onUpdated, onClose }) {
  const [payment, setPayment] = useState(paymentData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPayment(paymentData);
  }, [paymentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if the userId and reservationId fields are missing
    if (!payment.userId || !payment.reservationId) {
      console.error("userId or reservationId is missing:", payment);
      setIsLoading(false);
      return;
    }

    // Prepare the payment data to be sent to the backend
    const paymentData = {
      reservationId: parseInt(payment.reservationId, 10),
      userId: parseInt(payment.userId, 10),
      amount: parseFloat(payment.amount),
      paymentMethod: payment.paymentMethod,
      dateTime: new Date().toISOString(), // Add current date and time
    };

    try {
      const response = await fetch(
        `http://localhost:5296/api/Payments/UpdatePayment?paymentId=${payment.paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(paymentData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update payment");
      }
      const data = await response.json();
      setMessage("Payment updated successfully!");
      onUpdated(data);
      setTimeout(onClose, 3000); // Close form after 3 seconds
    } catch (error) {
      setMessage(error.message || "Failed to update payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Payment ID (Read-only):
          <input
            type="text"
            name="paymentId"
            value={payment.paymentId}
            readOnly
          />
        </label>
        <label>
          Reservation ID:
          <input
            type="text"
            name="reservationId"
            value={payment.reservationId}
            onChange={handleChange}
            required
            readOnly
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
            required
          />
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
          {isLoading ? "Updating..." : "Update Payment"}
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
