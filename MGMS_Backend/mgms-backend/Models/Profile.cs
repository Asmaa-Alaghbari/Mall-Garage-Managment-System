using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mgms_backend.Models
{
    // Represent the profile entity in the database
    public class Profile
    {
        [Key] // Data annotation for the primary key
        public int ProfileId { get; set; }
        [ForeignKey("User")] // Data annotation for the foreign key
        public int UserId { get; set; }
        public string Phone { get; set; }
        public string Preferences { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
