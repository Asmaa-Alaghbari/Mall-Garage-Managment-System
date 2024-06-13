import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaExpand,
  FaSearchPlus,
  FaSearchMinus,
  FaUndoAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ParkingSpotMap from "../Data/ParkingSpotMap.svg";
import {
  fetchCurrentUser,
  notifyError,
  sendFetchRequest,
} from "../Utils/Utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import "./Home.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [feedbackStatistics, setFeedbackStatistics] = useState({
    totalFeedbacks: 0,
    totalPositiveFeedbacks: 0,
    totalNegativeFeedbacks: 0,
    totalAnonymousFeedbacks: 0,
    averageRating: 0,
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
  const [userStatistics, setUserStatistics] = useState({
    totalUsersRole: 0,
    totalAdminsRole: 0,
    totalUsers: 0,
  });
  const [, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState("");
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
    }
  }, [user]);

  // Fetch the current user data from the backend and set the user state
  useEffect(() => {
    fetchCurrentUser(setUser, setIsLoading, setError, setUserRole);
  }, []);

  // Fetch the quote of the day
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const savedQuote = localStorage.getItem("quote");
    const savedQuoteDate = localStorage.getItem("quoteDate");

    if (savedQuote && savedQuoteDate === today) {
      setQuote(savedQuote);
    } else {
      axios
        .get("https://api.quotable.io/random")
        .then((response) => {
          setQuote(response.data.content);
          localStorage.setItem("quote", response.data.content);
          localStorage.setItem("quoteDate", today);
        })
        .catch((error) => {
          console.error("Error fetching the quote of the day: ", error);
        });
    }
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

  // Data for Parking Spot Summary Chart
  const parkingSpotData = {
    labels: ["Available", "Occupied"],
    datasets: [
      {
        label: "Parking Spots",
        data: [parkingSpotSummary.available, parkingSpotSummary.occupied],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  // Data for Reservation Statistics Chart
  const reservationData = {
    labels: ["Active", "Approved", "Completed", "Cancelled", "Pending"],
    datasets: [
      {
        label: "Reservations",
        data: [
          reservationStatistics.totalActiveReservations,
          reservationStatistics.totalApprovedReservations,
          reservationStatistics.totalCompletedReservations,
          reservationStatistics.totalCancelledReservations,
          reservationStatistics.totalPendingReservations,
        ],
        backgroundColor: [
          "#42a5f5",
          "#66bb6a",
          "#ffa726",
          "#ef5350",
          "#ab47bc",
        ],
      },
    ],
  };

  // Data for User Statistics Chart
  const userData = {
    labels: ["Users", "Admins"],
    datasets: [
      {
        label: "Users",
        data: [userStatistics.totalUsersRole, userStatistics.totalAdminsRole],
        backgroundColor: ["#42a5f5", "#ab47bc"],
      },
    ],
  };

  // Data for Feedback Statistics Chart
  const feedbackData = {
    labels: ["Positive", "Negative", "Anonymous"],
    datasets: [
      {
        label: "Feedbacks",
        data: [
          feedbackStatistics.totalPositiveFeedbacks,
          feedbackStatistics.totalNegativeFeedbacks,
          feedbackStatistics.totalAnonymousFeedbacks,
        ],
        backgroundColor: ["#66bb6a", "#ef5350", "#ffa726"],
      },
    ],
  };

  return (
    <div className="home-container">
      <header className="header">
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
                      onMouseDown={() => setIsSearchOpen(false)}
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

        <h1 className="welcome-title">
          Hello,{" "}
          {user &&
            user.username &&
            user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          !
        </h1>
        <p className="welcome-paragraph">
          Welcome to Your Ultimate Parking Command Center! Step into the hub of
          seamless parking management. At MGMS, we're not just about spaces and
          spots; we're about ensuring your experience is smooth and worry-free.
          Dive into your dashboard, where efficiency meets convenience, and let
          us take care of the rest. Enjoy the ease of managing your parking
          needs with just a few clicks!
        </p>
      </header>

      <main className="main-content">
        <section className="card">
          <h2 className="card-header">Quick Access</h2>
          <div className="card-body quick-access">
            <Link to="/profile" className="quick-access-link">
              <i className="fa fa-user"></i>
              <span>Profile</span>
            </Link>
            <Link to="/settings" className="quick-access-link">
              <i className="fa fa-cog"></i>
              <span>Settings</span>
            </Link>
            <Link to="/parking-spots" className="quick-access-link">
              <i className="fa fa-car"></i>
              <span>Parking Spots</span>
            </Link>
            <Link to="/services" className="quick-access-link">
              <i className="fa fa-wrench"></i>
              <span>Services</span>
            </Link>
            <Link to="/reservations" className="quick-access-link">
              <i className="fa fa-calendar"></i>
              <span>Reservations</span>
            </Link>
            <Link to="/feedbacks" className="quick-access-link">
              <i className="fa fa-comments"></i>
              <span>Feedback</span>
            </Link>
          </div>
        </section>

        <section className="card">
          <h2 className="card-header">Parking Spots</h2>
          <div className="card-body">
            <Pie data={parkingSpotData} />
            <li>
              <Link to="/parking-spots" className="nav-link">
                View All Parking Spots
              </Link>
            </li>
          </div>
        </section>

        {user?.role === "ADMIN" && (
          <section className="card">
            <h2 className="card-header">Reservations Statistics</h2>
            <div className="card-body">
              <Bar data={reservationData} />
              <li>
                <Link to="/reservations" className="nav-link">
                  View All Reservations
                </Link>
              </li>
            </div>
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
                  Add Payment
                </Link>
              </li>
            </ul>
          </section>
        )}

        {/* Map view of the parking spots */}
        <section className="card">
          <h2 className="card-header">Parking Spot Map</h2>
          <div className="card-body">
            <div className="map-view">
              <div className="map-container">
                <TransformWrapper>
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <>
                      <div className="tools">
                        <button
                          onClick={() => {
                            const elem =
                              document.querySelector(".map-container");
                            if (elem.requestFullscreen) {
                              elem.requestFullscreen();
                            } else if (elem.mozRequestFullScreen) {
                              elem.mozRequestFullScreen();
                            } else if (elem.webkitRequestFullscreen) {
                              elem.webkitRequestFullscreen();
                            } else if (elem.msRequestFullscreen) {
                              elem.msRequestFullscreen();
                            }
                          }}
                          title="Fullscreen"
                          style={{ backgroundColor: "#4CAF50", color: "white" }}
                        >
                          <FaExpand size={15} />
                        </button>
                        <button
                          onClick={() => zoomIn()}
                          title="Zoom In"
                          style={{ backgroundColor: "#4CAF50", color: "white" }}
                        >
                          <FaSearchPlus size={15} />
                        </button>
                        <button
                          onClick={() => zoomOut()}
                          title="Zoom Out"
                          style={{ backgroundColor: "#4CAF50", color: "white" }}
                        >
                          <FaSearchMinus size={15} />
                        </button>
                        <button
                          onClick={() => resetTransform()}
                          title="Reset"
                          style={{ backgroundColor: "#4CAF50", color: "white" }}
                        >
                          <FaUndoAlt size={15} />
                        </button>
                        <button
                          data-tooltip-id="mapDetailsTooltip"
                          title="Map Details"
                          style={{ backgroundColor: "#4CAF50", color: "white" }}
                        >
                          <FaInfoCircle size={15} />
                        </button>
                        <ReactTooltip
                          id="mapDetailsTooltip"
                          place="right"
                          effect="solid"
                        >
                          <div>
                            <p>C: Compact Cars (400x600cm) - Small</p>
                            <p>M: Motorcycles (400x600cm) - Small</p>
                            <p>S: Standard Cars (600x1000cm) - Medium</p>
                            <p>D: Disabled Parking (800x1200cm) - Large</p>
                            <p>L: Large Vehicles (800x1200cm) - Large</p>
                          </div>
                        </ReactTooltip>
                      </div>

                      <TransformComponent>
                        <img
                          src={ParkingSpotMap}
                          alt="Parking Spot Map"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            </div>
          </div>
        </section>

        {user?.role === "ADMIN" && (
          <>
            <section className="card">
              <h2 className="card-header">User Statistics</h2>
              <div className="card-body">
                <Doughnut data={userData} />
                <li>
                  <Link to="/users" className="nav-link">
                    View All Users
                  </Link>
                </li>
              </div>
            </section>

            <section className="card">
              <h2 className="card-header">Feedback Statistics</h2>
              <div className="card-body">
                <Line data={feedbackData} />
                <li>
                  <Link to="/feedbacks" className="nav-link">
                    View All Feedbacks
                  </Link>
                </li>
              </div>
            </section>
          </>
        )}
      </main>

      {/*  Display the quote of the day */}
      <section className="quote-weather-news">
        <div className="quote">
          <h3>Quote of the Day</h3>
          <blockquote className="quote-text">"{quote}"</blockquote>
        </div>
      </section>

      {/* Footer section for the CopyWrite */}
      <footer className="footer">
        <p>&copy; {currentYear} MGMS Company</p>
      </footer>
    </div>
  );
}
