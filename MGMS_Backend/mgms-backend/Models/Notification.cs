using System;

namespace MGMSBackend.Models
{
    // Represent the notification entity in the database
    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsRead { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
