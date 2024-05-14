using Microsoft.EntityFrameworkCore;
using mgms_backend.Data;
using mgms_backend.Entities;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Repositories.Implementation
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly ApplicationDbContext _context;

        public SettingsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get settings by user ID
        public async Task<Settings> GetSettingsByUserIdAsync(int userId)
        {
            return await _context.Settings.FirstOrDefaultAsync(s => s.UserId == userId);
        }

        // Update settings
        public async Task UpdateSettingsAsync(Settings settings)
        {
            if (settings.SettingsId != 0)
            {
                _context.Settings.Update(settings);
            }
            else
            {
                _context.Settings.Add(settings);
            }

            await _context.SaveChangesAsync();
        }
    }
}
