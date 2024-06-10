namespace mgms_backend.Entities.ParkingSpots
{
    // Represents the search criteria for parking spots
    public class ParkingSpotSearchCriteria
    {
        public string? Text { get; set; }
        public string? ParkingSpotNumber { get; set; }
        public string? Section { get; set; }
        public string? Size { get; set; }
        public string? Status { get; set; }
        public string? SortByProperty { get; set; } // Property name which is dynamically accessed during sorting
    }
}
