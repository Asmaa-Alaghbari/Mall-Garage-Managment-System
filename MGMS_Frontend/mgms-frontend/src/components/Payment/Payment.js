import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import AddPayment from "./AddPayment";
import {
  calculateIndex,
  fetchCurrentUser,
  formatDateTime,
  highlightText,
  notifySuccess,
  pagination,
  sendFetchRequest,
} from "../Utils/Utils";
import "../Utils/style.css";

export default function Payment({ newReservation }) {
  const [payments, setPayments] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchFormData, setSearchFormData] = useState({
    text: "",
    date: null,
    method: "",
    sortByProperty: "",
  });

  // Fetch payments and current user on component mount
  useEffect(() => {
    const fetchData = () => {
      fetchPayments();
      fetchCurrentUser(setUser, setIsLoading, setError);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]);

  // Update the payments state with the paginated data
  useEffect(() => {
    if (paginatedData && paginatedData.data) {
      setPayments(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [error, paginatedData]);

  useEffect(() => {
    if (newReservation) {
      const { reservationId, totalAmount } = newReservation;
      setPayments((prevPayments) => [
        ...prevPayments,
        {
          paymentId: prevPayments.length + 1,
          reservationId,
          amount: totalAmount,
          paymentStatus: "Unpaid",
        },
      ]);
    }
  }, [newReservation]);

  // Fetch payments from the API and update the state
  const fetchPayments = async () => {
    await sendFetchRequest(
      `payments/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      setError,
      setPaginatedData,
      searchFormData
    );
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    if (e.target.name === "date" && e.target.value === "") {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        date: null,
      }));
    } else {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle add payment success
  const handleSuccess = () => {
    fetchPayments();
    setShowAddForm(false);
    setShowUpdateForm(false);
  };

  // Update payment by ID
  const handleUpdate = (paymentId) => {
    const paymentToUpdate = payments.find(
      (payment) => payment.paymentId === paymentId
    );

    if (paymentToUpdate) {
      setSelectedPayment(paymentToUpdate);
      setShowUpdateForm(true);
    } else {
      console.error("Payment not found for update:", paymentId);
    }
  };

  // Delete payment by ID
  const handleDelete = async (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      const response = await sendFetchRequest(
        `Payments/DeletePayment/?paymentId=${paymentId}`,
        "DELETE",
        setIsLoading,
        setError
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchPayments();
      }
    }
  };

  // Handle unpaid button click
  const handleUnpaidButtonClick = (reservationId, amount) => {
    setSelectedPayment({ reservationId, amount, paymentStatus: "Unpaid" });
    setShowAddForm(true);
  };

  return (
    <div className="container">
      <h1>Payments</h1>
      {showAddForm && (
        <AddPayment
          onAddSuccess={handleSuccess}
          onClose={() => setShowAddForm(false)}
          paymentData={selectedPayment} // Pass the selected payment data
        />
      )}

      {showUpdateForm && selectedPayment && (
        <AddPayment
          paymentData={selectedPayment}
          paymentId={selectedPayment.paymentId} // Pass the paymentId
          onAddSuccess={handleSuccess}
          onClose={() => setShowUpdateForm(false)}
        />
      )}
      {!showAddForm && !showUpdateForm && (
        <>
          {/* Filters */}
          <div className="search-filter">
            <input
              type="text"
              name="text"
              placeholder="Search..."
              value={searchFormData.text}
              onChange={handleSearchInputChange}
            />

            {/* Filter by payment method */}
            <select
              value={searchFormData.method}
              text="method"
              name="method"
              onChange={handleSearchInputChange}
            >
              <option value="">All Methods</option>
              <option value="Credit card">Credit Card</option>
              <option value="debit card">Debit Card</option>
              <option value="paypal">Paypal</option>
            </select>

            {/* Filter by date */}
            <input
              type="date"
              name="date"
              placeholder="Filter by date..."
              value={searchFormData.date}
              onChange={handleSearchInputChange}
            />

            {/* Sort */}
            <select
              value={searchFormData.sortByProperty}
              name="sortByProperty"
              onChange={handleSearchInputChange}
            >
              {user && user.role === "ADMIN" && (
                <option value="PaymentId">Payment ID</option>
              )}
              <option value="ReservationId">Reservation ID</option>
              <option value="Amount">Amount</option>
              <option value="PaymentMethod">Payment Method</option>
              <option value="DateTime">Date</option>
              <option value="PaymentStatus">Payment Status</option>
            </select>
          </div>

          {/* Payment table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                {user && user.role === "ADMIN" && <th>Payment ID</th>}
                <th>Reservation ID</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: "40px",
                      }}
                    >
                      <BeatLoader
                        color="#000000"
                        loading={isLoading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                payments &&
                payments.map((payment, index) => (
                  <tr key={payment.paymentId}>
                    <td>
                      {highlightText(
                        calculateIndex(
                          index,
                          currentPage,
                          itemsPerPage
                        ).toString(),
                        searchFormData.text
                      )}
                    </td>
                    {user && user.role === "ADMIN" && (
                      <td>
                        {highlightText(
                          payment.paymentId?.toString() || "N/A",
                          searchFormData.text
                        )}
                      </td>
                    )}
                    <td>
                      {highlightText(
                        payment.reservationId?.toString() || "N/A",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      $
                      {highlightText(
                        payment.amount?.toString() || "N/A",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        payment.paymentMethod || "N/A",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {highlightText(
                        formatDateTime(payment.dateTime) || "N/A",
                        searchFormData.text
                      )}
                    </td>
                    <td>
                      {payment.paymentStatus === "Paid" ? (
                        <button className="paid-button" disabled>
                          Paid
                        </button>
                      ) : (
                        <button
                          className="unpaid-button"
                          onClick={() =>
                            handleUnpaidButtonClick(
                              payment.reservationId,
                              payment.amount
                            )
                          }
                        >
                          Unpaid
                        </button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(payment.paymentId)}>
                        Update
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(payment.paymentId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {pagination(totalPages, currentPage, setCurrentPage)}
          </div>

          <button onClick={() => setShowAddForm(true)}>Add New Payment</button>
        </>
      )}
    </div>
  );
}
