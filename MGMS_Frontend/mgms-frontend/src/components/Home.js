import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [parkingSpotSummary, setParkingSpotSummary] = useState({});
  const location = useLocation();

  // Fetch user data, recent reservations, and parking spot summary
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else if (location.state?.loggedIn) {
      // Handle successful login redirect scenario
      const newUser = JSON.parse(localStorage.getItem("user"));
      setUser(newUser);
    }

    // Fetch recent reservations (assuming an API endpoint)
    fetch('/api/reservations/recent')
      .then(response => response.json())
      .then(data => setRecentReservations(data))
      .catch(error => console.error('Error fetching recent reservations:', error));

    // Fetch parking spot summary (assuming an API endpoint)
    fetch('/api/parking-spots/summary')
      .then(response => response.json())
      .then(data => setParkingSpotSummary(data))
      .catch(error => console.error('Error fetching parking spot summary:', error));
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
          </ul>
        </section>
        <section className="card">
          <h2 className="card-header">My Reservations</h2>
          <ul className="card-body">
            {recentReservations.length > 0 ? (
              recentReservations.map(reservation => (
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
              <Link to="/reservations/create">Make a New Reservation</Link>
            </li>
          </ul>
        </section>
        <section className="card">
          <h2 className="card-header">Parking Spots</h2>
          <ul className="card-body">
            <li>
              Available: {parkingSpotSummary.available || 0}
            </li>
            <li>
              Occupied: {parkingSpotSummary.occupied || 0}
            </li>
            <li>
              Total: {parkingSpotSummary.total || 0}
            </li>
            <li>
              <Link to="/parking-spots">View All Parking Spots</Link>
            </li>
            <li>
              <Link to="/parking-spots/create">Add a New Parking Spot</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
