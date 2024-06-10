import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import AddUser from "./AddUser";
import {
  calculateIndex,
  highlightText,
  notifySuccess,
  pagination,
  sendFetchRequest,
  sendNotification,
} from "../Utils/Utils";
import "../Utils/style.css";

// Display a list of all users with the ability to promote/demote and delete users
export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState(); // Store parking spots from the API
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [searchFormData, setSearchFormData] = useState({
    // Search form data
    text: "",
    role: "",
    sortByProperty: "",
  });
  const itemsPerPage = 5; // Number of items per page

  // Fetch users from the API on component mount
  useEffect(() => {
    fetchUsers(); // Fetch users from the API
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFormData, currentPage]);

  // Update the users and total pages when the paginated data changes
  useEffect(() => {
    if (paginatedData) {
      setUsers(paginatedData.data);
      setTotalPages(paginatedData.totalPages);
    }
  }, [paginatedData]);

  // Handle adding a new user to the list of users
  const addUser = () => {
    fetchUsers();
    setShowAddForm(false);
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    await sendFetchRequest(
      `auth/searchpaginated?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
      "POST",
      setIsLoading,
      undefined,
      setPaginatedData,
      searchFormData
    );
  };

  // Update a user's role
  const updateUserRole = async (userId, newRole) => {
    const response = await sendFetchRequest(
      `auth/UpdateRole/?UserId=${userId}`,
      "PUT",
      setIsLoading,
      undefined,
      undefined,
      { userId: userId, role: newRole }
    );

    if (response && response.message) {
      notifySuccess(response.message);
      sendNotification(
        userId,
        undefined,
        `Your role has been changed to: ${newRole}!`,
        setIsLoading
      );

      await fetchUsers();
    }
  };

  // Toggle a user's role between ADMIN and USER
  const toggleUserRole = (userId, currentRole) => {
    // Check if the user is trying to demote themselves and they have the ADMIN role
    if (
      userId === parseInt(sessionStorage.getItem("userId")) &&
      currentRole === "ADMIN"
    ) {
      alert("You cannot demote yourself from the Admin role!");
      return;
    }

    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const actionLabel =
      currentRole === "ADMIN" ? "Demote to User" : "Promote to Admin";
    const confirmToggle = window.confirm(
      `Are you sure you want to ${actionLabel} this user?`
    );
    if (confirmToggle) {
      updateUserRole(userId, newRole);
    }
  };

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    setCurrentPage(1);

    setSearchFormData((prevSearchFormData) => ({
      ...prevSearchFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Check if the user is trying to delete themselves and they have the ADMIN role
      if (userId === parseInt(sessionStorage.getItem("userId"))) {
        alert("You cannot delete yourself!");
        return;
      }

      const response = await sendFetchRequest(
        `auth/Delete/?UserId=${userId}`,
        "DELETE",
        setIsLoading
      );

      if (response && response.message) {
        notifySuccess(response.message);
        await fetchUsers();
      }
    }
  };

  return (
    <div className="container">
      <h1>All Users</h1>

      {/* Add user form */}
      {showAddForm && (
        <AddUser onAddSuccess={addUser} onClose={() => setShowAddForm(false)} />
      )}
      {!showAddForm && (
        <div>
          {/* Search */}
          <div className="search-filter">
            <input
              type="text"
              name="text"
              placeholder="Search..."
              value={searchFormData.text}
              onChange={handleSearchInputChange}
            />

            {/* Filter by role */}
            <select
              value={searchFormData.role}
              name="role"
              onChange={handleSearchInputChange}
            >
              <option value="">Filter by Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            {/* Sort by */}
            <select
              name="sortByProperty"
              value={searchFormData.sortByProperty}
              onChange={handleSearchInputChange}
            >
              <option value="">Sort by</option>
              <option value="UserId">User ID</option>
              <option value="Username">Username</option>
              <option value="Email">Email</option>
              <option value="Role">Role</option>
            </select>
          </div>

          {/* Users table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
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
                users &&
                users.map((user, index) => (
                  <tr key={user.userId}>
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
                    <td>
                      {highlightText(
                        user.userId.toString(),
                        searchFormData.text
                      )}
                    </td>
                    <td>{highlightText(user.username, searchFormData.text)}</td>
                    <td>{highlightText(user.email, searchFormData.text)}</td>
                    <td>
                      {highlightText(
                        user.phone.toString(),
                        searchFormData.text
                      )}
                    </td>
                    <td>{highlightText(user.role, searchFormData.text)}</td>
                    <td>
                      <button
                        onClick={() => toggleUserRole(user.userId, user.role)}
                        disabled={
                          user.userId ===
                            parseInt(sessionStorage.getItem("userId")) &&
                          user.role === "ADMIN"
                        }
                      >
                        {user.role === "ADMIN"
                          ? "Demote to User"
                          : "Promote to Admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        disabled={
                          user.userId ===
                            parseInt(sessionStorage.getItem("userId")) &&
                          user.role === "ADMIN"
                        }
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

          {/* Button to add a new user */}
          <button onClick={() => setShowAddForm(true)}>Add New User</button>
        </div>
      )}
    </div>
  );
}
