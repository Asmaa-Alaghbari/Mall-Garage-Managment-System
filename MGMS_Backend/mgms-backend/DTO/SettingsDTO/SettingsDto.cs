namespace mgms_backend.DTO.SettingsDTO
{
    // Represents the settings of a user
    public class SettingsDTO
    {
        public int UserId { get; set; }
        public bool ReceiveNotifications { get; set; }
        public bool DarkMode { get; set; }
    }
}
