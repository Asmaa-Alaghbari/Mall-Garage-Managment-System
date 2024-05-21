namespace mgms_backend.DTO.NotificationDTO
{
    // Notification DTO for the notification entity
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public int? ReservationId { get; set; }
        public bool IsRead { get; set; }
        public string Message { get; set; }
        public string? TimeLeftToReservation { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}
