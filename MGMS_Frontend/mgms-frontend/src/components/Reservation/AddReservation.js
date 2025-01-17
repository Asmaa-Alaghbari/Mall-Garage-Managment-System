import React, { useState, useEffect } from "react";
import {
  fetchCurrentUser,
  formatDateToISOWithoutOffset,
  notifyError,
  notifySuccess,
  sendFetchRequest,
  sendNotification,
  sendNotificationToRole,
} from "../Utils/Utils";
import Select from "react-select";
import "../Utils/AddStyle.css";

export default function AddReservation({
  onAddSuccess, // Callback function to handle successful reservation addition
  onUpdateSuccess, // Callback function to handle successful reservation update
  onClose, // Callback function to handle form close
  isUpdate = false, // Flag to determine if the form is for updating a reservation
  reservationData = null, // Reservation data to pre-populate the form for update
}) {
  // Initialize the reservation state with user ID pre-populated if user data is available
  const [reservation, setReservation] = useState({
    userId: "", // Pre-populate the user ID if user data is available
    parkingSpotNumber: 0,
    startTime: "",
    endTime: "",
    status: "Pending", // Default status is "Pending" for new reservations
    serviceIds: [],
    totalAmount: 0,
    parkingSpotPrice: 0,
  });
  const [userRole, setUserRole] = useState(""); // State to hold user role
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableServiceOptions, setAvailableServiceOptions] = useState([]);
  const [, setError] = useState(null);

  // Fetch the current user and available services on component mount
  useEffect(() => {
    fetchCurrentUser(setReservation, setIsLoading, setError, setUserRole);
    fetchAvailableServices();

    if (reservationData) {
      fetchParkingSpotPrice(
        reservationData.parkingSpotNumber,
        reservationData.startTime,
        reservationData.endTime
      ); // Fetch the price of the parking spot if updating
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the reservation state with the reservation data and available service options
  useEffect(() => {
    if (isUpdate && reservationData && availableServiceOptions) {
      updateReservation(reservationData);
    }

    calculateTotalAmount(); // Calculate the total amount of the reservation

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isUpdate,
    reservationData,
    availableServiceOptions,
    reservation.startTime,
    reservation.endTime,
    selectedOptions,
  ]);

  // Fetch available services from the API
  const fetchAvailableServices = async () => {
    const response = await sendFetchRequest(
      `services/searchpaginated`,
      "POST",
      setIsLoading
    );

    if (response && response.length !== 0) {
      const options = response.map((item) => ({
        value: item.serviceId.toString(), // Convert id to string if needed
        label: `${item.name} - ${item.price}$`,
        price: item.price, // Store the price in the option
      }));

      setAvailableServiceOptions(options);
    }
  };

  // Fetch the price of a parking spot from the API
  const fetchParkingSpotPrice = async (
    parkingSpotNumber,
    startTime,
    endTime
  ) => {
    if (!parkingSpotNumber || !startTime || !endTime) return;

    const response = await sendFetchRequest(
      `reservations/GetParkingSpotPrice?parkingSpotNumber=${parkingSpotNumber}&startTime=${startTime}&endTime=${endTime}`,
      "GET",
      setIsLoading,
      setError
    );

    if (response) {
      setReservation((prev) => ({
        ...prev,
        parkingSpotPrice: response,
      }));

      calculateTotalAmount(selectedOptions, response); // Recalculate total amount with new parking spot price
    }
  };

  // Update the reservation state with the reservation data
  const updateReservation = (data) => {
    const updatedReservation = {
      ...reservation,
      ...data,
    };
    updatedReservation.startTime = data.startTime
      ? formatDateToISOWithoutOffset(new Date(data.startTime))
      : ""; // Convert Date to ISO string with UTC+3 offset

    updatedReservation.endTime = data.endTime
      ? formatDateToISOWithoutOffset(new Date(data.endTime))
      : ""; // Convert Date to ISO string with UTC+3 offset

    const updatedSelectedOptions = [];
    data.serviceIds.forEach((serviceId) => {
      const service = availableServiceOptions.find(
        (service) => service.value === serviceId.toString()
      );
      if (service) {
        updatedSelectedOptions.push({
          value: service.value,
          label: service.label,
          price: service.price,
        });
      }
    });

    setSelectedOptions(updatedSelectedOptions);
    setReservation(updatedReservation);
  };

  // Update the reservation state
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a date field (startTime or endTime) and convert it to UTC
    if (name === "startTime" || name === "endTime") {
      // Convert the local date and time to ISO string
      const localDate = new Date(value);
      const utcDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes()
        )
      );

      // Format the UTC date to match datetime-local format: YYYY-MM-DDTHH:mm
      const formattedDate = utcDate.toISOString().slice(0, 16);

      // Update the reservation state with the UTC date
      setReservation((prev) => ({
        ...prev,
        [name]: formattedDate, // Convert UTC date back to string
      }));

      if (reservation.parkingSpotNumber) {
        fetchParkingSpotPrice(
          reservation.parkingSpotNumber,
          reservation.startTime,
          reservation.endTime
        );
      }
    } else if (name === "parkingSpotNumber") {
      setReservation((prev) => ({
        ...prev,
        [name]: value,
      }));
      fetchParkingSpotPrice(value, reservation.startTime, reservation.endTime); // Fetch the price when the parking spot number changes
    } else {
      // Update the reservation state with the new value
      setReservation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate start time and end time
    const startTime = new Date(reservation.startTime).getTime();
    const endTime = new Date(reservation.endTime).getTime();
    const currentTime = new Date().getTime();

    if (startTime >= endTime) {
      notifyError("Start time must be before end time.");
      return;
    }

    if (startTime < currentTime || endTime < currentTime) {
      notifyError("Reservation date and time cannot be in the past.");
      return;
    }

    // Prepare the reservation data to be sent to the backend
    if (selectedOptions.length !== 0) {
      reservation.serviceIds = selectedOptions.map((item) => item.value);
    }

    // Convert the reservation data to the correct format
    const apiEndpoint = reservationData
      ? `reservations/UpdateReservation?reservationId=${reservationData.reservationId}`
      : "reservations/AddReservation";

    const response = await sendFetchRequest(
      apiEndpoint,
      reservationData ? "PUT" : "POST",
      setIsLoading,
      undefined,
      undefined,
      reservation
    );

    if (response && response.message) {
      notifySuccess(response.message);

      if (!reservationData && response.data) {
        // Send notification to user for new reservation
        sendNotification(
          reservation.userId,
          response.data.reservationId,
          `You have created a new reservation for parking spot with number ${reservation.parkingSpotNumber}.`,
          setIsLoading
        );

        // Send notification to admin role for new reservation
        sendNotificationToRole(
          "ADMIN",
          response.data.reservationId,
          `(ADMINS ONLY) A new reservation for parking spot with number ${reservation.parkingSpotNumber} has been created.`,
          setIsLoading
        );

        // Call the onAddSuccess callback function with the new reservation ID and total amount
        onAddSuccess(response.data.reservationId, reservation.totalAmount);
      }

      // Send notification to user for updated reservation
      if (reservationData && reservationData.status !== reservation.status) {
        sendNotification(
          reservationData.userId,
          response.data.reservationId,
          `Reservation with Id ${reservationData.reservationId} has changed status: ${reservationData.status} -> ${reservation.status}.`,
          setIsLoading
        );
      }

      onAddSuccess();
    }
  };

  // Handle service select change
  const handleServiceSelectChange = (selected) => {
    setSelectedOptions(selected);
    calculateTotalAmount(selected);
  };

  // Calculate the total amount of the reservation based on the selected services and parking spot price
  const calculateTotalAmount = (services = selectedOptions) => {
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);

    const diffTime = Math.abs(endTime - startTime);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    let totalAmount = 0;

    // Charge $5 per hour after the first 2 hours
    if (diffHours > 2) {
      totalAmount += (diffHours - 2) * 5;
    }

    // Add the price of the parking spot
    services.forEach((service) => {
      totalAmount += service.price;
    });

    setReservation((prev) => ({
      ...prev,
      totalAmount,
    }));
  };

  // Handle reservation cancellation
  const handleCancelReservation = async () => {
    if (!reservationData || !reservationData.reservationId) {
      notifyError("No reservation selected to cancel.");
      return;
    }

    const response = await sendFetchRequest(
      `reservations/DeleteReservation?reservationId=${reservationData.reservationId}`,
      "DELETE",
      setIsLoading,
      undefined,
      undefined,
      reservation
    );

    if (response && response.message) {
      notifySuccess(response.message);
      onUpdateSuccess(); // Call the onUpdateSuccess callback function after cancellation
    }
  };

  return (
    <div className="general-container">
      <h2>{isUpdate ? "Update Reservation" : "Add Reservation"}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="userId"
          value={reservation.userId}
          onChange={handleChange}
          required
          readOnly // User ID is read-only since it's automatically set
          hidden // Hide the user ID field from the form
          className="input-field"
        />
        <div className="form-group">
          <label>Parking Spot Number:</label>
          <input
            type="number"
            name="parkingSpotNumber"
            value={reservation.parkingSpotNumber}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={reservation.startTime}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={reservation.endTime}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        {userRole === "ADMIN" && (
          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={reservation.status}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Select desired services:</label>
          <div className="multi-select">
            <Select
              options={availableServiceOptions}
              isMulti
              value={selectedOptions}
              onChange={handleServiceSelectChange}
            />
          </div>
          <div className="form-group">
            <label>Total Amount: ${reservation.totalAmount.toFixed(2)}</label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? isUpdate
                ? "Updating..."
                : "Adding..."
              : isUpdate
              ? "Update Reservation"
              : "Add Reservation"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
          {isUpdate && (
            <button
              type="button"
              onClick={handleCancelReservation}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
