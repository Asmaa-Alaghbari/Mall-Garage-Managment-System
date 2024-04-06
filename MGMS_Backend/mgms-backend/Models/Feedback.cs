using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mgms_backend.Models
{
    // Represent the feedback entity in the database
    public class Feedback
    {
        [Key] // Data annotation for the primary key
        public int FeedbackId { get; set; }
        [ForeignKey("User")] // Data annotation for the foreign key
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
