namespace mgms_backend.DTO.FeedbackDTO
{
    // Represents a Feedback DTO that is used to transfer feedback data between the client and server
    public class FeedbackDto
    {
        public int FeedbackId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Message { get; set; }
        public string FeedbackType { get; set; }
        public bool IsAnonymous { get; set; }
        public DateTime DateTime { get; set; }
    }
}
