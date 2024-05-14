namespace mgms_backend.Entities.Reservations
{
    // Represents the search criteria for reservations
    public class ReservationSearchCriteria
    {
        public int UserId { get; set; }
        public string? Text { get; set; }
        public string? Status { get; set; }
        public DateTime? Date { get; set; }
        public string? SortByProperty { get; set; }
    }
}
