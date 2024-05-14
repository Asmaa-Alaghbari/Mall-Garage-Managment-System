namespace mgms_backend.Entities.Payments
{
    // Represent the payment entity in the database
    public class PaymentSearchCriteria
    {
        public int UserId { get; set; }
        public string? Text { get; set; }
        public string? Method { get; set; }
        public string? SortByProperty { get; set; }
        public DateTime? Date { get; set; }
    }
}
