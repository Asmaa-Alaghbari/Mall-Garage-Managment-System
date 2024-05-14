using mgms_backend.Entities;

namespace mgms_backend.Repositories.Interface
{
    public interface ISettingsRepository
    {
        Task<Settings> GetSettingsByUserIdAsync(int userId); // Get settings by user ID
        Task UpdateSettingsAsync(Settings settings); // Update settings
    }
}
