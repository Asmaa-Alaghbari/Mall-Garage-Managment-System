import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const location = useLocation();
  const [parkingSpotSummary, setParkingSpotSummary] = useState({
    available: 0,
    occupied: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data, recent reservations, and parking spot summary
  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parking spot summary:", error);
        setError(error.toString());
        setIsLoading(false);
      });
  }, [location]);

  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome, {user && user.name}!</h1>
        <p>Your dashboard for managing parking spaces.</p>
      </header>
      <main className="main-content">
        <section className="card">
          <h2 className="card-header">My Account</h2>
          <ul className="card-body">
            <li>
              <Link to="/profile">View Profile</Link>
            </li>
            <li>
              <Link to="/settings">Manage Settings</Link>
            </li>
            <li>
              <Link to="/feedbacks">Provide Feedback</Link>
            </li>
          </ul>
        </section>
        <section className="card">
          <h2 className="card-header">My Reservations</h2>
          <ul className="card-body">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <li key={reservation.id}>
                  <Link to={`/reservations/${reservation.id}`}>
                    {reservation.parkingSpot} - {reservation.date}
                  </Link>
                </li>
              ))
            ) : (
              <li>No recent reservations found.</li>
            )}
            <li>
              <Link to="/reservations">View All Reservations</Link>
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
              <Link to="/parking-spots">View All Parking Spots</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
