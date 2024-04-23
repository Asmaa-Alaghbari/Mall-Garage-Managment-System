using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    public interface ISettingsRepository
    {
        Task<Settings> GetSettingsByUserIdAsync(int userId); // Get settings by user ID
        Task UpdateSettingsAsync(Settings settings); // Update settings
    }
}
