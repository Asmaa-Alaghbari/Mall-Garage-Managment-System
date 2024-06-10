import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FaEye } from "react-icons/fa";
import {
  calculateIndex,
  fetchCurrentUser,
  formatDateTime,
  highlightText,
  notifySuccess,
  pagination,
  sendFetchRequest,
  ShowMessageModel,
} from "../Utils/Utils";
import "../Utils/style.css";

// Notification component
export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]); // Store parking spots from the API
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [totalPages, setTotalPages] = useState(1); // Pagination
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchFormData, setSearchFormData] = useState({
    text: "",
    date: null,
    isRead: null,
    userId: 0,
    sortByProperty: "",
  });
  const itemsPerPage = 5;

  // Fetch the current user data from the backend
  useEffect(() => {
    fetchCurrentUser(setUser, setIsLoading, setError);
  }, []);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]);

  // Update notifications and total pages when paginated data changes
  useEffect(() => {
    if (paginatedData) {
      setNotifications(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [error, paginatedData]);

  // Fetch notifications
  const fetchNotifications = async () => {
    const userId = user?.role || "USER" === "ADMIN" ? 0 : user?.userId;

    searchFormData.userId = userId;

    await sendFetchRequest(
      `notifications/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      setError,
      setPaginatedData,
      searchFormData
    );
  };

  // Mark notification as read or unread by notification ID
  const markNotificationAsReadOrUnread = async (notificationId) => {
    const response = await sendFetchRequest(
      `notifications/MarkAsReadOrUnread?notificationId=${notificationId}`,
      "PUT",
      setIsLoading,
      setError
    );

    if (response) {
      notifySuccess(response.message); 
    }

    fetchNotifications();
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    if (e.target.name === "date" && e.target.value === "") {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        date: null,
      }));
    } else if (e.target.name === "isRead") {
      let isRead;

      if (e.target.value === "") {
        isRead = null;
      } else if (e.target.value === "true") {
        isRead = true;
      } else {
        isRead = false;
      }

      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        isRead: isRead,
      }));
    } else {
      setSearchFormData((prevSearchFormData) => ({
        ...prevSearchFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const response = await sendFetchRequest(
        `notifications/DeleteNotification/?notificationId=${notificationId}`,
        "DELETE",
        setIsLoading,
        setError
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchNotifications();
      }
    }
  };

  // Show a modal with the given message
  const handleShowMessage = (message) => {
    setModalMessage(message); // Set the message to be displayed in the modal
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="container">
      <h1>Notifications</h1>
      <>
        {/* Search */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchFormData.text}
            name="text"
            onChange={handleSearchInputChange}
          />

          {/* Filter by date */}
          <input
            type="date"
            placeholder="Date..."
            value={searchFormData.date}
            name="date"
            onChange={handleSearchInputChange}
          />

          <select
            value={searchFormData.isRead}
            onChange={handleSearchInputChange}
            name="isRead"
          >
            <option value="">Filter by read status...</option>
            <option value="true">Read</option>
            <option value="false">Not read</option>
          </select>

          <select
            value={searchFormData.sortByProperty}
            onChange={handleSearchInputChange}
            name="sortByProperty"
          >
            <option value="">Sort by...</option>
            <option value="NotificationId">Notification ID</option>
            <option value="Message">Message</option>
            <option value="DateTime">Date</option>
            <option value="IsRead">Is Read</option>
          </select>
        </div>

        {/* Reservation table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>No.</th>
              {user && user.role === "ADMIN" && <th>Notification ID</th>}
              <th>Date</th>
              <th>Read Status</th>
              <th>Message</th>
              {user && user.role === "ADMIN" && <th>User ID</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
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
              notifications &&
              notifications.map((notification, index) => (
                <tr key={notification.notificationId}>
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
                        notification.notificationId.toString(),
                        searchFormData.text
                      )}
                    </td>
                  )}
                  
                  <td>
                    {highlightText(
                      formatDateTime(notification.dateTime),
                      searchFormData.text
                    )}
                  </td>
                  <td>
                    {highlightText(
                      notification.isRead ? (
                        <FaEye color="green" />
                      ) : (
                        <FaEye color="red" />
                      ),
                      searchFormData.text
                    )}
                  </td>
                  <td>
                    {highlightText(
                      <button
                        onClick={() =>
                          handleShowMessage(
                            notification.message,
                            searchFormData.text
                          )
                        }
                      >
                        Show Message
                      </button>
                    )}
                  </td>
                  {user && user.role === "ADMIN" && (
                    <td>
                      {highlightText(
                        notification.userId.toString(),
                        searchFormData.text
                      )}
                    </td>
                  )}

                  <td>
                    {notification.isRead ? (
                      <button
                        onClick={() =>
                          markNotificationAsReadOrUnread(
                            notification.notificationId
                          )
                        }
                      >
                        Mark as unread
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          markNotificationAsReadOrUnread(
                            notification.notificationId
                          )
                        }
                      >
                        Mark as read
                      </button>
                    )}
                    {user && user.role === "ADMIN" && (
                      <button
                        onClick={() =>
                          handleDelete(notification.notificationId)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {pagination(totalPages, currentPage, setCurrentPage)}
        </div>
      </>

      {/* Modal to display notification message */}
      <ShowMessageModel isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h4>Notification Message</h4>
        <p>{modalMessage}</p>
      </ShowMessageModel>
    </div>
  );
}
