using System.ComponentModel.DataAnnotations;

namespace mgms_backend.Models
{
    // Represent the parking spot entity in the database
    public class ParkingSpot
    {
        [Key]  // Data annotation for the primary key
        public int ParkingSpotId { get; set; }
        public string Number { get; set; }
        public string Section { get; set; }
        public bool IsOccupied { get; set; }
        public string Size { get; set; }

        // Navigation properties for related entities
        public ICollection<Reservation> Reservations { get; set; }
    }
}
