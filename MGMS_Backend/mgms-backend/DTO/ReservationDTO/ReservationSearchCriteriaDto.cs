namespace mgms_backend.DTO.ReservationDTO
{
    // Reservation Search Criteria Data Transfer Object for searching reservations
    public class ReservationSearchCriteriaDto
    {
        public int UserId { get; set; }
        public string? Text { get; set; }
        public string? Status { get; set; }
        public string? SortByProperty { get; set; }
        public DateTime? Date { get; set; }
    }
}
