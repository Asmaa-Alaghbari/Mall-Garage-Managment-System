import React from "react";
import "./Info.css";

export default function Info() {
  return (
    <div className="info-container">
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Welcome to MGMS! We are dedicated to providing the best parking
          management services. Our team is passionate about making your parking
          experience seamless and hassle-free. Our mission is to improve the
          efficiency and user experience of parking management in mall garages
          by offering a comprehensive solution that includes user management,
          parking spot management, reservations, payments, notifications, and
          settings.
        </p>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="faq-item">
          <h3>How do I make a reservation?</h3>
          <p>
            To make a reservation, go to the Reservations page and click on "Add
            Reservation". Fill in the required details such as the parking spot,
            date, and time, and submit the form. You can also select additional
            services if needed.
          </p>
        </div>
        <div className="faq-item">
          <h3>What payment methods are accepted?</h3>
          <p>
            We accept credit cards, debit cards, and PayPal. Payments can be
            made through the Payments section in your account.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I update my profile information?</h3>
          <p>
            Yes, you can update your profile information by going to the Profile
            section. You can change your personal details, such as your name,
            email, phone number, and address.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I view and manage my notifications?</h3>
          <p>
            You can view and manage your notifications in the Notifications
            section. Here you can see all the updates regarding your
            reservations, payments, and other important information. You can
            also configure your notification settings in the Settings section.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I search for a parking spot?</h3>
          <p>
            To search for a parking spot, go to the Parking Spot section. You
            can choose to view the spots in a table format with details like
            spot number, section, and size, or on a map for a visual
            representation. Use the search filters to find spots based on
            number, section, status, and size.
          </p>
        </div>
        <div className="faq-item">
          <h3>What services are available through MGMS?</h3>
          <p>
            MGMS offers various services such as car wash, oil change, and more.
            You can view and book these services through the Services section,
            which provides details like the name, description, price, and
            duration of each service.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I cancel or modify my reservation?</h3>
          <p>
            Yes, you can cancel or modify your reservation by going to the
            Reservations section. Select the reservation you want to change and
            follow the instructions to update or cancel it.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: contact@mgms.com</p>
        <p>Phone: (123) 456-7890</p>
        <p>Address: 123 Parking Street, Mall City, Romania</p>
      </section>
    </div>
  );
}
