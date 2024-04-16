import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Reservations from "./components/Reservation/Reservations";
import ParkingSpots from "./components/ParkingSpot/ParkingSpots";
import Logout from "./components/Auth/Logout";

import "./App.css";
import Payment from "./components/Payment/Payment";
import Feedback from "./components/Feedback/Feedback";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state for the user

  useEffect(() => {
    // Check if the user is logged in by verifying the token or other credentials
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set the login state based on the token's presence
  }, []);

  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/parking-spots"
            element={isLoggedIn ? <ParkingSpots /> : <Navigate to="/login" />}
          />
          <Route
            path="/reservations"
            element={isLoggedIn ? <Reservations /> : <Navigate to="/login" />}
          />
          <Route
            path="/payments"
            element={isLoggedIn ? <Payment /> : <Navigate to="/login" />}
          />
          <Route
            path="/feedbacks"
            element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />}
          />
          <Route
            path="/logout"
            element={
              isLoggedIn ? (
                <Logout setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}
