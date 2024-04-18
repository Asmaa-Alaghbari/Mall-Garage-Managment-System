import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [parkingSpotSummary, setParkingSpotSummary] = useState({
    available: 0,
    occupied: 0,
    total: 0,
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({
    givenCount: 0,
    avgRating: 0,
    receivedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch other pages data
  useEffect(() => {
    setIsLoading(true);

    // Fetch user data
    fetch("http://localhost:5296/api/auth/GetUser", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.toString());
      });

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

    // Fetch feedbacks based on user role
    const fetchFeedbacksUrl =
      user?.role === "ADMIN"
        ? "http://localhost:5296/api/feedbacks/GetAllFeedbacks"
        : `http://localhost:5296/api/feedbacks/GetFeedbackByUserId?userId=${localStorage.getItem(
            "userId"
          )}`;

    fetch(fetchFeedbacksUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch feedbacks: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.emptyFeedbackList) {
          setFeedbacks([]);
        } else if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location, user?.id, user?.role]);

  // Calculate feedback stats whenever feedbacks or user changes
  useEffect(() => {
    const givenCount = feedbacks.length; // Feedbacks given by the user
    const totalRating = feedbacks.reduce(
      // Total rating of feedbacks given by the user
      (acc, feedback) => acc + feedback.rating,
      0
    );
    // Average rating of feedbacks given by the user
    const avgRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

    setFeedbackStats({
      givenCount,
      avgRating,
      receivedCount: user?.role === "ADMIN" ? feedbacks.length : 0, // Feedbacks received by the user
    });
  }, [feedbacks, user]);

  return (
    <div className="home-container">
      <header className="header">
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
        <section className="card">
          <h2 className="card-header">Feedbacks</h2>
          <div className="feedback-stats">
            <p>Given Feedbacks: {feedbackStats.givenCount}</p>
            <p>Average Rating: {feedbackStats.avgRating.toFixed(2)}</p>
            {user?.role === "ADMIN" && (
              <p>Received Feedbacks: {feedbacks.length}</p>
            )}
          </div>
          <div className="feedback-links">
            {user?.role === "USER" && (
              <Link to="/feedbacks" className="nav-link">
                View My Feedbacks
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link to="/feedbacks" className="nav-link">
                View All Feedbacks
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
