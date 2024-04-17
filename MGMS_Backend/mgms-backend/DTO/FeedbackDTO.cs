namespace mgms_backend.DTO
{
    public class FeedbackDTO
    {
        public int FeedbackId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public int Rating { get; set; } 
        public string FeedbackType { get; set; } 
        public bool IsAnonymous { get; set; } 
        public DateTime DateTime { get; set; }
    }
}
