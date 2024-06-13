import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import Reservations from "./components/Reservation/Reservations";
import AddReservation from "./components/Reservation/AddReservation";
import ParkingSpots from "./components/ParkingSpot/ParkingSpots";
import AddParkingSpot from "./components/ParkingSpot/AddParkingSpot";
import Payment from "./components/Payment/Payment";
import AddPayment from "./components/Payment/AddPayment";
import Feedback from "./components/Feedback/Feedback";
import AddFeedback from "./components/Feedback/AddFeedback";
import Settings from "./components/Settings/Settings";
import UsersList from "./components/Auth/UserList";
import AddUser from "./components/Auth/AddUser";
import Service from "./components/Services/Service";
import Notification from "./components/Notification/Notification";
import Info from "./components/Info/Info";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state for the user

  useEffect(() => {
    // Check if the user is logged in by verifying the token or other credentials
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token); // Set the login state based on the token's presence

    // Check for token expiration
    const tokenExpiration = sessionStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();
    if (tokenExpiration && currentTime > tokenExpiration) {
      // Token expired, log out the user
      logout();
    }
  }, []);

  // Function to handle logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiration");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <ToastContainer />
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
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
            path="/parking-spots/add"
            element={isLoggedIn ? <AddParkingSpot /> : <Navigate to="/login" />}
          />
          <Route
            path="/reservations"
            element={isLoggedIn ? <Reservations /> : <Navigate to="/login" />}
          />
          <Route
            path="/reservations/add"
            element={isLoggedIn ? <AddReservation /> : <Navigate to="/login" />}
          />
          <Route
            path="/payments"
            element={isLoggedIn ? <Payment /> : <Navigate to="/login" />}
          />
          <Route
            path="/payments/add"
            element={isLoggedIn ? <AddPayment /> : <Navigate to="/login" />}
          />
          <Route
            path="/feedbacks"
            element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />}
          />
          <Route
            path="/feedbacks/add"
            element={isLoggedIn ? <AddFeedback /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={isLoggedIn ? <UsersList /> : <Navigate to="/login" />}
          />
          <Route
            path="/users/add"
            element={isLoggedIn ? <AddUser /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <Settings setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/services"
            element={isLoggedIn ? <Service /> : <Navigate to="/login" />}
          />
          <Route
            path="/services/add"
            element={isLoggedIn ? <Service /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={isLoggedIn ? <Notification /> : <Navigate to="/login" />}
          />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}
