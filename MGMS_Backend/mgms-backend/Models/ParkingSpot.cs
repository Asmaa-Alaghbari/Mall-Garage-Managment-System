using System.Collections.Generic;

namespace MGMSBackend.Models
{
    // Represent the parking spot entity in the database
    public class ParkingSpot
    {
        public int ParkingSpotId { get; set; }
        public string Number { get; set; }
        public string Section { get; set; }
        public bool IsOccupied { get; set; }
        public string Size { get; set; }

        // Navigation properties for related entities
        public ICollection<Reservation> Reservations { get; set; }
    }
}
