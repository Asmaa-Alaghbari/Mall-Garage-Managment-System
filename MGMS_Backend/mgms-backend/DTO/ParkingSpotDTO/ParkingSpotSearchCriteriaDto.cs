namespace mgms_backend.DTO.ParkingSpotDTO
{
    // Data transfer object for parking spot search criteria
    public class ParkingSpotSearchCriteriaDto
    {
        public string? Text { get; set; }
        public string? ParkingSpotNumber { get; set; }
        public string? Section { get; set; }
        public string? Size { get; set; }
        public string? Status { get; set; }
        public string? SortByProperty { get; set; }
    }
}
