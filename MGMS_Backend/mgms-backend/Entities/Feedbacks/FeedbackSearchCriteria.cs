namespace mgms_backend.Entities.Feedbacks
{
    // Represents the search criteria for feedback
    public class FeedbackSearchCriteria
    {
        public string? Text { get; set; } // Search text
        public string? Type { get; set; } // Feedback type 
        public int Rating { get; set; } // Rating
        public DateTime? Date { get; set; } // Date
        public int UserId { get; set; } // User Id
        public string? SortByProperty { get; set; } // Property to sort by
    }
}
