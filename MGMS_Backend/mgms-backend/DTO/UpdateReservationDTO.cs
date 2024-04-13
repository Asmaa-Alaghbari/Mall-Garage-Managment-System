namespace mgms_backend.DTO
{
    public class UpdateReservationDTO
    {
        public int ParkingSpotId { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
    }
}
