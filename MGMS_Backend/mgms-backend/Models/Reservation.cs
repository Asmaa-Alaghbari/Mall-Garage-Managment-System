using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mgms_backend.Models
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
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }

        // Navigation properties for related entities 
        public User User { get; set; }
        public ParkingSpot ParkingSpot { get; set; }
        public ICollection<Service> Services { get; set; }
        public ICollection<ReservationService> ReservationServices { get; set; }
        public ICollection<Payment> Payments { get; set; }

    }
}
