namespace mgms_backend.DTO.ServiceDTO
{
    // Service DTO for service entity
    public class ServiceDto
    {
        public int ServiceId { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
