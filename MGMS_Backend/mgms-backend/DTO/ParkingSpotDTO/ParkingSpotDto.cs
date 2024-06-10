namespace mgms_backend.DTO.ParkingSpotDTO
{
    // Represents a parking spot data transfer object
    public class ParkingSpotDto
    {
        public int ParkingSpotId { get; set; }
        public int ParkingSpotNumber { get; set; }
        public string Section { get; set; }
        public string Size { get; set; }
        public bool IsOccupied { get; set; } = false;
    }
}
