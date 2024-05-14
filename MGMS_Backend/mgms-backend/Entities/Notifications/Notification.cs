using System.ComponentModel.DataAnnotations;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities.Notifications
{
    // Represent the notification entity in the database
    public class Notification
    {
        [Key] // Data annotation for the primary key
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsRead { get; set; }

        // Navigation properties for related entities
        public virtual User Users{ get; set; }
    }
}
