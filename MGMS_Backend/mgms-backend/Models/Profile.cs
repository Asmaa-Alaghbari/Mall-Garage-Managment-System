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
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string? ProfilePictureUrl { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
