namespace mgms_backend.DTO.ReservationDTO
{
    // Reservation Data Transfer Object for mapping Reservation entity
    public class ReservationDto
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotNumber { get; set; }
        public int[] ServiceIds { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
    }
}
