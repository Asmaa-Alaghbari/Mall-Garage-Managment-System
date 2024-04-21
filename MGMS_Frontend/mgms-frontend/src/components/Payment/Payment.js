import React, { useState, useEffect } from "react";
import { formatDateTime, highlightText, paginate } from "../../Utils";
import AddPayment from "./AddPayment";
import UpdatePayment from "./UpdatePayment";
import "./Payment.css";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(10); // Number of items to display per page
  const [searchTerm, setSearchTerm] = useState(""); // search term
  const [sortType, setSortType] = useState("paymentId"); // Sort by payment ID by default
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all"); // payment method filter
  const [dateFilter, setDateFilter] = useState(""); // date filter
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm && !showUpdateForm) {
      fetchPayments();
    }
  }, [showAddForm, showUpdateForm]);

  // Fetch payments from the API and update the state
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

  // Filter payments based on search term, status, and date
  const filteredPayments = payments.filter((payment) => {
    return (
      (payment.amount.toString().includes(searchTerm) ||
        payment.paymentMethod
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.paymentId.toString().includes(searchTerm) ||
        payment.dateTime.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (paymentMethodFilter === "all" ||
        payment.paymentMethod.toLowerCase() ===
          paymentMethodFilter.toLowerCase()) &&
      (dateFilter ? payment.dateTime.includes(dateFilter) : true)
    );
  });

  // Sort payments
  let sortedPayments = [...filteredPayments];

  if (sortType === "dateTime") {
    sortedPayments = sortedPayments.sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );
  } else if (sortType === "amount") {
    sortedPayments = sortedPayments.sort((a, b) => a.amount - b.amount);
  } else if (sortType === "paymentMethod") {
    sortedPayments = sortedPayments.sort((a, b) =>
      a.paymentMethod.localeCompare(b.paymentMethod)
    );
  }

  // Pagination
  const paginatedPayments = paginate(sortedPayments, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

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
          {/* Filters */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Filter by payment method */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">Paypal</option>
              <option value="cash">Cash</option>
            </select>
            {/* Filter by date */}
            <input
              type="date"
              placeholder="Filter by date..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            {/* Sort by amount, payment method, or date */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="amount">Amount</option>
              <option value="paymentMethod">Payment Method</option>
              <option value="dateTime">Date</option>
            </select>
          </div>

          {/* Payment table */}
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td>
                    {highlightText(payment.paymentId.toString(), searchTerm)}
                  </td>
                  <td>
                    {highlightText(payment.amount.toString(), searchTerm)}
                  </td>
                  <td>{highlightText(payment.paymentMethod, searchTerm)}</td>
                  <td>
                    {highlightText(
                      formatDateTime(payment.dateTime),
                      searchTerm
                    )}
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              )}
          </div>
          <button onClick={() => setShowAddForm(true)}>Add New Payment</button>
        </>
      )}
    </div>
  );
}
