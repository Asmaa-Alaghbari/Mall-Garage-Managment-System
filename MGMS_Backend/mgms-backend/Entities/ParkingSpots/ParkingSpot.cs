using System.ComponentModel.DataAnnotations;

namespace mgms_backend.Entities.ParkingSpots
{
    // Represent the parking spot entity in the database
    public class ParkingSpot
    {
        [Key]  // Data annotation for the primary key
        public int ParkingSpotId { get; set; }
        public int Number { get; set; }
        public string Section { get; set; }
        public string Size { get; set; }
        public bool IsOccupied { get; set; } = false; // Default value
    }
}
