namespace mgms_backend.DTO.NotificationDTO
{
    // Notification search criteria DTO
    public class NotificationSearchCriteriaDto
    {
        public int UserId { get; set; }
        public bool? IsRead { get; set; }
        public string? Text { get; set; }
        public string? SortByProperty { get; set; }
        public DateTime? Date { get; set; }
    }
}
