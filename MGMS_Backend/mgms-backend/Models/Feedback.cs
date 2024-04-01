using System;

namespace MGMSBackend.Models
{
    // Represent the feedback entity in the database
    public class Feedback
    {
        public int FeedbackId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
