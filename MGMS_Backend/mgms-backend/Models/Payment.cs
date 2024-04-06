using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mgms_backend.Models
{
    // Represent the payment entity in the database
    public class Payment
    {
        [Key] // Data annotation for the primary key
        public int PaymentId { get; set; }
        [ForeignKey("Reservation")] // Data annotation for the foreign key
        public int ReservationId { get; set; }
        [ForeignKey("User")] // Data annotation for the foreign key
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime DateTime { get; set; }

        // Navigation properties for related entities
        public Reservation Reservation { get; set; }
        public User User { get; set; }
    }
}
