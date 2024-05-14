using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.Users;

namespace mgms_backend.Entities.Feedbacks
{
    // Represent the feedback entity in the database
    public class Feedback
    {
        [Key] // Data annotation for the primary key
        public int FeedbackId { get; set; }
        [ForeignKey("User")] // Data annotation for the foreign key
        public int UserId { get; set; } // Foreign key to the User entity
        public int Rating { get; set; } // Rating can be from 1 to 5
        public string Message { get; set; } // Feedback message
        public string FeedbackType { get; set; } // Feedback type can be either "complaint" or "suggestion"
        public bool IsAnonymous { get; set; } // Boolean value to check if the feedback is anonymous
        public DateTime DateTime { get; set; } // Date and time when the feedback was submitted

        // Navigation properties for related entities
        public virtual User User { get; set; } // Navigation property to the User entity
    }
}
