using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly ApplicationDbContext _context;

        public SettingsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Settings> GetSettingsByUserIdAsync(int userId)
        {
            return await _context.Settings.FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task UpdateSettingsAsync(Settings settings)
        {
            _context.Entry(settings).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}