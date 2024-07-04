using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.Reservations;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities.Payments
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
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero!")]
        public decimal Amount { get; set; }
        [MaxLength(50)] // Data annotation for the maximum length of the string
        [Required]
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } // "Paid" or "Unpaid"
        public DateTime DateTime { get; set; }

        // Navigation properties for related entities
        public virtual Reservation Reservation { get; set; }
        public virtual User User { get; set; }
    }
}
