import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchCurrentUser,
  notifyError,
  sendFetchRequest,
} from "../Utils/Utils";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [feedbackStatistics, setFeedbackStatistics] = useState({
    totalFeedbacks: 0,
    totalPositiveFeedbacks: 0,
    totalNegativeFeedbacks: 0,
    totalAnonymousFeedbacks: 0,
    averageRating: 0,
  });
  const [notificationsStatistics, setNotificationsStatistics] = useState({
    total: 0,
    unread: 0,
  });
  const [parkingSpotSummary, setParkingSpotSummary] = useState({
    available: 0,
    occupied: 0,
    total: 0,
  });
  const [reservationStatistics, setReservationStatistics] = useState({
    totalReservations: 0,
    totalActiveReservations: 0,
    totalApprovedReservations: 0,
    totalCompletedReservations: 0,
    totalCancelledReservations: 0,
    totalPendingReservations: 0,
  });
  const [servicesStatistics, setServicesStatistics] = useState({
    total: 0,
  });
  const [userStatistics, setUserStatistics] = useState({
    totalUsersRole: 0,
    totalAdminsRole: 0,
    totalUsers: 0,
  });
  const [, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear(); // Get the current year

  // Handle side effects after error is updated
  useEffect(() => {
    if (error && error !== null) {
      if (!error.message) {
        notifyError("Failed to fetch from server!");
      } else {
        notifyError(error.message);
      }
    }
  }, [error]);

  // Fetch API data from the backend and set the state
  useEffect(() => {
    if (user && user !== null) {
      if (user?.role === "ADMIN") {
        // Fetch user statistics
        sendFetchRequest(
          "auth/GetUserStatistics",
          "GET",
          setIsLoading,
          setError,
          setUserStatistics
        );

        // Fetch feedback statistics
        sendFetchRequest(
          "Feedbacks/GetFeedbackStatistics",
          "GET",
          setIsLoading,
          setError,
          setFeedbackStatistics
        );
      }

      // Fetch notifications statistics
      sendFetchRequest(
        `notifications/GetNotificationsStatistics?userId=${
          user?.role === "ADMIN" ? 0 : user?.userId || 0
        }`,
        "GET",
        setIsLoading,
        setError,
        setNotificationsStatistics
      );

      // Fetch parking spot summary
      sendFetchRequest(
        "parkingspots/GetParkingSpotSummary",
        "GET",
        setIsLoading,
        setError,
        setParkingSpotSummary
      );

      // Fetch reservations statistics
      sendFetchRequest(
        `reservations/GetReservationStatistics`,
        "GET",
        setIsLoading,
        setError,
        setReservationStatistics
      );

      // Fetch services statistics
      sendFetchRequest(
        "services/GetServicesStatistics",
        "GET",
        setIsLoading,
        setError,
        setServicesStatistics
      );
    }
  }, [user]);

  // Fetch the current user data from the backend and set the user state
  useEffect(() => {
    fetchCurrentUser(setUser, setIsLoading, setError, setUserRole);
  }, []);

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
      { path: "/feedbacks", name: "Feedback" },
      { path: "/notifications", name: "Notifications" },
      { path: "/parking-spots", name: "ParkingSpots" },
      { path: "/profile", name: "Profile" },
      { path: "/payments", name: "Payment" },
      { path: "/reservations", name: "Reservations" },
      { path: "/services", name: "Services" },
      { path: "/settings", name: "Settings" },
      { path: "/users", name: "Users" },
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
          <h2 className="card-header">Parking Spots</h2>
          <ul className="card-body">
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

        {user?.role === "ADMIN" && (
          <section className="card">
            <h2 className="card-header">Reservations Statistics</h2>
            <ul className="card-body">
              {isLoading ? (
                <li>Loading recent reservations...</li>
              ) : (
                <>
                  <li>
                    Total Active Reservations:{" "}
                    {reservationStatistics.totalActiveReservations}
                  </li>
                  <li>
                    Total Approved Reservations:{" "}
                    {reservationStatistics.totalApprovedReservations}
                  </li>
                  <li>
                    Total Completed Reservations:{" "}
                    {reservationStatistics.totalCompletedReservations}
                  </li>
                  <li>
                    Total Cancelled Reservations:{" "}
                    {reservationStatistics.totalCancelledReservations}
                  </li>
                  <li>
                    Total Pending Reservations:{" "}
                    {reservationStatistics.totalPendingReservations}
                  </li>
                  <li>
                    Total Reservations:{" "}
                    {reservationStatistics.totalReservations}
                  </li>
                </>
              )}
              <li>
                <Link to="/reservations" className="nav-link">
                  View All Reservations
                </Link>
              </li>
            </ul>
          </section>
        )}

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
                <Link to="/payments/add" className="nav-link">
                  {" "}
                  Add Payment
                </Link>
              </li>
            </ul>
          </section>
        )}

        <section className="card">
          <h2 className="card-header">Services Statistics</h2>
          <ul className="card-body">
            <li>Total Services: {servicesStatistics.total}</li>
            <li>
              <Link to="/services" className="nav-link">
                View All Services
              </Link>
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 className="card-header">Notifications Statistics</h2>
          <ul className="card-body">
            <li>Total Notifications: {notificationsStatistics.total}</li>
            <li>Unread Notifications: {notificationsStatistics.unread}</li>
            <li>
              <Link to="/notifications" className="nav-link">
                View All Notifications
              </Link>
            </li>
          </ul>
        </section>

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
                Average Rating: {feedbackStatistics.averageRating?.toFixed(2)}
              </li>
              <li>
                <Link to="/feedbacks" className="nav-link">
                  View All Feedbacks
                </Link>
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
