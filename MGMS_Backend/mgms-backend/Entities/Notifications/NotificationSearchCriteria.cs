namespace mgms_backend.Entities.Notifications
{
    // Represent the notification search criteria
    public class NotificationSearchCriteria
    {
        public string? Text { get; set; }
        public DateTime? Date { get; set; }
        public bool? IsRead { get; set; } 
        public int UserId { get; set; }
        public string? SortByProperty { get; set; }
    }
}
