namespace mgms_backend.Entities.Services
{
    // Represents the search criteria for services
    public class ServiceSearchCriteria
    {
        public string? Text { get; set; }
        public string? SortByProperty { get; set; }
    }
}
