namespace mgms_backend.DTO
{
    public class ReservationDTO
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
    }
}
