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
          experience seamless and hassle-free.
        </p>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="faq-item">
          <h3>How do I make a reservation?</h3>
          <p>
            To make a reservation, go to the Reservations page and click on "Add
            Reservation". Fill in the required details and submit the form.
          </p>
        </div>
        <div className="faq-item">
          <h3>How can I contact support?</h3>
          <p>
            You can contact our support team by emailing support@mgms.com or by
            calling (123) 456-7890.
          </p>
        </div>
        <div className="faq-item">
          <h3>What payment methods are accepted?</h3>
          <p>We accept credit cards, debit cards, and PayPal.</p>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: contact@mgms.com</p>
        <p>Phone: (123) 456-7890</p>
      </section>
    </div>
  );
}
