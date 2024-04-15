import React, { useState, useEffect } from "react";
import AddPayment from "./AddPayment";
import UpdatePayment from "./UpdatePayment";
import "./Payment.css";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm && !showUpdateForm) {
      fetchPayments();
    }
  }, [showAddForm, showUpdateForm]);

  const fetchPayments = () => {
    setIsLoading(true);
    fetch("http://localhost:5296/api/Payments/GetAllPayments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        return response.json();
      })
      .then((data) => {
        setPayments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setError(error.message);
        setIsLoading(false);
      });
  };

  const handleAddSuccess = (newPayment) => {
    setPayments([...payments, newPayment]);
    setShowAddForm(false);
  };

  const handleUpdateSuccess = (updatedPayment) => {
    const updatedPayments = payments.map((payment) =>
      payment.paymentId === updatedPayment.paymentId ? updatedPayment : payment
    );
    setPayments(updatedPayments);
    setShowUpdateForm(false);
  };

  const handleDelete = (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      fetch(
        `http://localhost:5296/api/Payments/DeletePayment?paymentId=${paymentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to delete payment");
            });
          }
          setPayments(
            payments.filter((payment) => payment.paymentId !== paymentId)
          );
          alert("Payment deleted successfully!");
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert(error.message);
        });
    }
  };

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-container">
      <h1>Payments</h1>
      {showAddForm && (
        <AddPayment
          onAddSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {showUpdateForm && selectedPayment && (
        <UpdatePayment
          paymentData={selectedPayment}
          onUpdated={handleUpdateSuccess}
          onClose={() => setShowUpdateForm(false)}
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {payments.map((payment) => (
            <li key={payment.paymentId}>
              Payment ID: {payment.paymentId}, Amount: {payment.amount}, Method:{" "}
              {payment.paymentMethod}, Date: {payment.dateTime}
              <button
                onClick={() => {
                  setSelectedPayment(payment);
                  setShowUpdateForm(true);
                }}
              >
                Update
              </button>
              <button onClick={() => handleDelete(payment.paymentId)}>
                Delete
              </button>
            </li>
          ))}
          <button onClick={() => setShowAddForm(true)}>Add New Payment</button>
        </>
      )}
    </div>
  );
}