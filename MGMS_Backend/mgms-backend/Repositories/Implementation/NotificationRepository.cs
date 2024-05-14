using Microsoft.EntityFrameworkCore;
using mgms_backend.Data;
using mgms_backend.Entities.Notifications;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Repositories.Implementation
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all notifications
        public async Task<IList<Notification>> GetAllAsync()
        {
            return await _context.Notifications.ToListAsync();
        }

        // Get all notifications by user id
        public async Task<IList<Notification>> GetByUserIdAsync(int userId)
        {
            return await _context.Notifications.Where(x => x.UserId.Equals(userId)).ToListAsync();
        }

        // Get notification by notification id
        public async Task<Notification?> GetByNotificationIdAsync(int notificationId)
        {
            return await _context.Notifications.FindAsync(notificationId);
        }

        // Get unread notifications by user id
        public async Task<IList<Notification>> GetUnreadByUserIdAsync(int userId)
        {
            return await _context.Notifications.Where(x => x.UserId.Equals(userId) && !x.IsRead).ToListAsync();
        }

        // Search notifications
        public async Task<List<Notification>> SearchAsync(NotificationSearchCriteria? searchCriteria = null)
        {
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Notifications.ToListAsync();
            }

            var query = _context.Notifications.AsQueryable();

            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.NotificationId.ToString().Contains(searchCriteria.Text) ||
                    x.DateTime.ToString().Contains(searchCriteria.Text) ||
                    x.Message.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            if (searchCriteria.IsRead.HasValue)
            {
                query = query.Where(x => x.IsRead.Equals(searchCriteria.IsRead.Value));
            }

            if (searchCriteria.Date.HasValue)
            {
                query = query.Where(x =>
                    x.DateTime.Day.Equals(searchCriteria.Date.Value.Day) &&
                    x.DateTime.Month.Equals(searchCriteria.Date.Value.Month) &&
                    x.DateTime.Year.Equals(searchCriteria.Date.Value.Year));
            }

            if (searchCriteria.UserId != default)
            {
                query = query.Where(x => x.UserId.Equals(searchCriteria.UserId));
            }

            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                query = query.OrderByDynamic(searchCriteria.SortByProperty);
            }

            return await query.ToListAsync();
        }

        // Add notification
        public async Task AddAsync(Notification toCreate)
        {
            await _context.Notifications.AddAsync(toCreate);
            await _context.SaveChangesAsync();
        }

        // Update notification
        public async Task UpdateAsync(Notification toUpdate)
        {
            _context.Notifications.Update(toUpdate);
            await _context.SaveChangesAsync();
        }

        // Delete notification
        public async Task DeleteAsync(Notification toDelete)
        {
            _context.Notifications.Remove(toDelete);

            await _context.SaveChangesAsync();
        }
    }
}
