using System;

namespace MGMSBackend.Models
{
    // Represent the reservation entity in the database
    public class Reservation
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
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
