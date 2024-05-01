import React, { useState, useEffect } from "react";
import { highlightText, paginate, pagination } from "../Utils";
import AddUser from "./AddUser";
import "../style.css";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [filterByRole, setFilterByRole] = useState("all"); // Filter
  const [sortBy, setSortBy] = useState("userId"); // Sort
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [itemsPerPage] = useState(5); // Pagination
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // Show/hide the add form
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddForm) {
      loadUsers();
    }
  }, [showAddForm]);

  // Handle adding a new user to the list of users
  const addUser = (newUser) => {
    setUsers([...users, newUser]); // Add the new user to the list
    setShowAddForm(false); // Close the add form
  };

  // Fetch all users from the backend
  const loadUsers = () => {
    setIsLoading(true);

    fetch("http://localhost:5296/api/auth/GetAll", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data:", data);
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error.message);
        setIsLoading(false);
      });
  };

  // Delete a user by userId
  const deleteUser = (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:5296/api/auth/Delete?UserId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete user");
          }
          return response.json();
        })
        .then(() => {
          loadUsers();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setError(error.message);
        });
    }
  };

  // Toggle a user's role between ADMIN and USER
  const toggleUserRole = (userId, currentRole) => {
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

  // Update a user's role by userId
  const updateUserRole = (userId, newRole) => {
    fetch(`http://localhost:5296/api/auth/UpdateRole`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, role: newRole }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user role");
        }
        return response.json();
      })
      .then(() => {
        loadUsers();
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        setError(error.message);
      });
  };

  // Filter users by role and search term
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();

    const roleMatch =
      filterByRole === "all" ||
      user.role.toLowerCase() === filterByRole.toLowerCase();

    const matchesSearchTerm =
      user.userId.toString().toLowerCase().includes(searchTermLower) ||
      user.username.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phone.toString().toLowerCase().includes(searchTermLower) ||
      (user.profile?.address &&
        user.profile.address.toLowerCase().includes(searchTermLower));

    return roleMatch && matchesSearchTerm;
  });

  // Sort users by chosen criteria
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "userId") {
      return a.userId - b.userId;
    }
    if (sortBy === "username") {
      return a.username.localeCompare(b.username);
    }
    if (sortBy === "email") {
      return a.email.localeCompare(b.email);
    }
    if (sortBy === "role") {
      return a.role.localeCompare(b.role);
    }
    // Default sort by userId in ascending order
    return a.userId - b.userId;
  });

  // Paginate users
  const paginatedUsers = paginate(sortedUsers, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter by role */}
            <select
              value={filterByRole}
              onChange={(e) => setFilterByRole(e.target.value)}
            >
              <option value="all">Filter by Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            {/* Sort by */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="userId">Sort by</option>
              <option value="userId">User ID</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>
          </div>

          {/* Users table */}
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{highlightText(user.userId.toString(), searchTerm)}</td>{" "}
                  <td>{highlightText(user.username, searchTerm)}</td>
                  <td>{highlightText(user.email, searchTerm)}</td>
                  <td>{highlightText(user.phone.toString(), searchTerm)}</td>
                  <td>{highlightText(user.role, searchTerm)}</td>
                  <td>
                    <button
                      onClick={() => toggleUserRole(user.userId, user.role)}
                    >
                      {user.role === "ADMIN"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </button>
                    <button onClick={() => deleteUser(user.userId)}>
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
