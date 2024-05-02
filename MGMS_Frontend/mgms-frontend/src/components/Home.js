import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchCurrentUser } from "./Utils";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentReservations] = useState([]);
  const [parkingSpotSummary, setParkingSpotSummary] = useState({
    available: 0,
    occupied: 0,
    total: 0,
  });
  const [userStatistics, setUserStatistics] = useState({
    totalUsersRole: 0,
    totalAdminsRole: 0,
    totalUsers: 0,
  });
  const [feedbackStatistics, setFeedbackStatistics] = useState({
    totalFeedbacks: 0,
    totalPositiveFeedbacks: 0,
    totalNegativeFeedbacks: 0,
    totalAnonymousFeedbacks: 0,
    averageRating: 0,
  });
  const [, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear(); // Get the current year
  const location = useLocation();

  // Fetch other pages data
  useEffect(() => {
    setIsLoading(true);

    // Fetch user data
    fetchCurrentUser(setUser, setIsLoading, setError, setUserRole);

    if (user?.role === "ADMIN") {
      // Fetch user statistics
      fetch("http://localhost:5296/api/auth/GetUserStatistics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error(
                "Forbidden: You are not authorized to view this resource."
              );
            }
            throw new Error(
              `Failed to fetch user statistics: ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          setUserStatistics(data);
        })
        .catch((error) => {
          console.error("Error fetching user statistics:", error);
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch feedback statistics
      fetch("http://localhost:5296/api/Feedbacks/GetFeedbackStatistics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch feedback statistics");
          }
          return response.json();
        })
        .then((data) => {
          setFeedbackStatistics(data);
        })
        .catch((error) => {
          console.error("Error fetching feedback statistics:", error);
          setError(error.toString());
        });
    }

    // Fetch the parking spot summary (available, occupied, total)
    fetch("http://localhost:5296/api/parkingspots/GetParkingSpotSummary", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch parking spots summary");
        }
        return response.json();
      })
      .then((data) => {
        setParkingSpotSummary(data);
      })
      .catch((error) => {
        console.error("Error fetching parking spot summary:", error);
        setError(error.toString());
      });
  }, [location, user?.id, user?.role]);

  // Handle search input change and filter matching routes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length === 0) {
      setIsSearchOpen(false);
      setSearchResults([]);
      return;
    }

    // Search for matching routes
    const matchingRoutes = [
      { path: "/profile", name: "Profile" },
      { path: "/reservations", name: "Reservations" },
      { path: "/parking-spots", name: "ParkingSpots" },
      { path: "/payments", name: "Payment" },
      { path: "/feedbacks", name: "Feedback" },
      { path: "/settings", name: "Settings" },
    ].filter((route) => route.name.toLowerCase().includes(term));

    setSearchResults(matchingRoutes);
    setIsSearchOpen(true);
  };

  // Handle search input blur and close search results
  const handleSearchBlur = () => {
    setIsSearchOpen(false);
  };

  // Handle search input keydown and close search results on Escape key
  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        {/* Search bar */}
        <div className="search-container">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyDown}
            />
            <i className="fa fa-search search-icon"></i>
          </div>
          {isSearchOpen && (
            <section className="search-results">
              <ul className="card-body">
                {searchResults.map((route) => (
                  <li key={route.path} className="result-item">
                    <Link
                      to={route.path}
                      onClick={() => setIsSearchOpen(false)}
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
                {searchResults.length === 0 && (
                  <li>No matching pages found.</li>
                )}
              </ul>
            </section>
          )}
        </div>

        <h1>
          Welcome,{" "}
          {user &&
            user.username &&
            user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          !
        </h1>
        <p>Your dashboard for managing parking spaces.</p>
      </header>
      <main className="main-content">
        <section className="card">
          <h2 className="card-header">My Account</h2>
          <ul className="card-body">
            <li>
              <Link to="/profile" className="nav-link">
                View Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="nav-link">
                Manage Settings
              </Link>
            </li>
            <li>
              <Link to="/feedbacks" className="nav-link">
                Provide Feedback
              </Link>
            </li>
          </ul>
        </section>
        <section className="card">
          <h2 className="card-header">My Reservations</h2>
          <ul className="card-body">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <li key={reservation.id}>
                  <Link
                    to={`/reservations/${reservation.id}`}
                    className="nav-link"
                  >
                    {reservation.parkingSpot} - {reservation.date}
                  </Link>
                </li>
              ))
            ) : (
              <li>No recent reservations found.</li>
            )}
            <li>
              <Link to="/reservations" className="nav-link">
                View All Reservations
              </Link>
            </li>
          </ul>
        </section>
        <section className="card">
          <h2 className="card-header">Parking Spots</h2>
          <ul className="card-body">
            {error && <li className="error">Error: {error}</li>}
            {isLoading ? (
              <li>Loading parking spots summary...</li>
            ) : (
              <>
                <li>Available: {parkingSpotSummary.available || 0}</li>
                <li>Occupied: {parkingSpotSummary.occupied || 0}</li>
                <li>Total: {parkingSpotSummary.total || 0}</li>
              </>
            )}
            <li>
              <Link to="/parking-spots" className="nav-link">
                View All Parking Spots
              </Link>
            </li>
          </ul>
        </section>
        {user?.role === "USER" && (
          <section className="card">
            <h2 className="card-header">Payments</h2>
            <ul className="card-body">
              <li>
                <Link to="/payments" className="nav-link">
                  View Payment History
                </Link>
              </li>
              <li>
                <Link to="/payments/add" className="nav-link"> Add Payment</Link>
              </li>
            </ul>
          </section>
        )}



        {/* Display user statistics for admin users */}
        {user?.role === "ADMIN" && (
          <section className="card">
            <h2 className="card-header">User Statistics</h2>
            <ul className="card-body">
              <li>Total Users: {userStatistics.totalUsersRole}</li>
              <li>Total Admins: {userStatistics.totalAdminsRole}</li>
              <li>Total Users: {userStatistics.totalUsers}</li>
              <li>
                <Link to="/users" className="nav-link">
                  View All Users
                </Link>
              </li>
            </ul>
          </section>
        )}

        {/* Display feedback statistics for admin users */}
        {user?.role === "ADMIN" && (
          <section className="card">
            <h2 className="card-header">Feedback Statistics</h2>
            <ul className="card-body">
              <li>Total Feedbacks: {feedbackStatistics.totalFeedbacks}</li>
              <li>
                Total Positive Feedbacks:{" "}
                {feedbackStatistics.totalPositiveFeedbacks}
              </li>
              <li>
                Total Negative Feedbacks:{" "}
                {feedbackStatistics.totalNegativeFeedbacks}
              </li>
              <li>
                Total Anonymous Feedbacks:{" "}
                {feedbackStatistics.totalAnonymousFeedbacks}
              </li>
              <li>
                Average Rating: {feedbackStatistics.averageRating.toFixed(2)}
              </li>
            </ul>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {currentYear} MGMS Company</p>
      </footer>
    </div>
  );
}
