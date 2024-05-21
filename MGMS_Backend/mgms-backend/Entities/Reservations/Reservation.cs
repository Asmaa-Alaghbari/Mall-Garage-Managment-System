using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.ParkingSpots;
using mgms_backend.Entities.Payments;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities.Reservations
{
    // Represent the reservation entity in the database
    public class Reservation
    {
        [Key] // Data annotation for the primary key
        public int ReservationId { get; set; }
        [ForeignKey("User")] // Data annotation for the foreign key
        public int UserId { get; set; }
        [ForeignKey("ParkingSpot")] // Data annotation for the foreign key
        public int ParkingSpotId { get; set; }
        public int ParkingSpotNumber { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }

        // Navigation properties for related entities 
        public virtual User User { get; set; }
        public virtual ParkingSpot ParkingSpot { get; set; }
        public virtual ICollection<ReservationService> Services { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
