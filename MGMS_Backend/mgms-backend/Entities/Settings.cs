using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities
{
    public class Settings
    {
        [Key] // Denotes the primary key
        public int SettingsId { get; set; } // Primary key
        [ForeignKey("UserId")] // Denotes the foreign key
        public int UserId { get; set; }
        public bool ReceiveNotifications { get; set; } // Whether the user wants to receive notifications
        public bool DarkMode { get; set; } // Whether the user wants to use dark mode

        // Navigation property to User
        public virtual User User { get; set; }
    }
}
