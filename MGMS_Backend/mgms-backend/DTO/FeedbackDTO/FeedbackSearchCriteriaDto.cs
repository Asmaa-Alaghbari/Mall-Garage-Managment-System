namespace mgms_backend.DTO.FeedbackDTO
{
    // Data transfer object for Feedback search criteria
    public class FeedbackSearchCriteriaDto
    {
        public int UserId { get; set; } // User ID
        public int Rating { get; set; } // Feedback rating
        public string? Text { get; set; } // Feedback text
        public string? Type { get; set; } // Feedback type
        public string? SortByProperty { get; set; } // Property to sort by
        public DateTime? Date { get; set; } // Feedback date
    }
}
