namespace mgms_backend.DTO.PaymentDTO.PaymentDTO
{
    // Payment search criteria DTO for filtering payments
    public class PaymentSearchCriteriaDto
    {
        public int UserId { get; set; }
        public string? Text { get; set; }
        public string? Method { get; set; }
        public string? SortByProperty { get; set; }
        public DateTime? Date { get; set; }
    }
}
