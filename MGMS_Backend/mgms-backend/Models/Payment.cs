using System;

namespace MGMSBackend.Models
{
    // Represent the payment entity in the database
    public class Payment
    {
        public int PaymentId { get; set; }
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime DateTime { get; set; }

        // Navigation properties for related entities
        public Reservation Reservation { get; set; }
        public User User { get; set; }
    }
}
