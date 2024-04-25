namespace mgms_backend.DTO
{
    public class ProfileDto
    {
        public int UserId { get; set; }
        public string Address { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string ZipCode { get; set; } = default!;
        public string Country { get; set; } = default!;
        public string? ProfilePictureUrl { get; set; }
    }
}
