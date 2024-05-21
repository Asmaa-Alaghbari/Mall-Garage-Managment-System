using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.Reservations;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities.Notifications
{
    // Represent the notification entity in the database
    public class Notification
    {
        [Key] // Data annotation for the primary key
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        [ForeignKey("Reservation")]
        public int? ReservationId { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsRead { get; set; }

        // Navigation properties for related entities
        public virtual Reservation Reservation { get; set; }
        public virtual User Users { get; set; }
    }
}
