namespace MGMSBackend.Models
{
    // Represent the profile entity in the database
    public class Profile
    {
        public int ProfileId { get; set; }
        public int UserId { get; set; }
        public string Phone { get; set; }
        public string Preferences { get; set; }

        // Navigation properties for related entities
        public User User { get; set; }
    }
}
