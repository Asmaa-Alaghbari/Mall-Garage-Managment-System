namespace mgms_backend.DTO
{
    public class ParkingSpotDTO
    {
        public int ParkingSpotId { get; set; } 
        public string Number { get; set; }
        public string Section { get; set; }
        public string Size { get; set; }
        public bool IsOccupied { get; set; } = false;
    }
}
