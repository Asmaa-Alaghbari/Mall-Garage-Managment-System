using mgms_backend.Entities.Notifications;

namespace mgms_backend.Repositories.Interface
{
    public interface INotificationRepository
    {
        Task<Notification?> GetByNotificationIdAsync(int notificationId); // Get notification by notification ID
        Task<IList<Notification>> GetAllAsync(); // Get all notifications
        Task<IList<Notification>> GetByUserIdAsync(int userId); // Get notifications by user ID
        Task<IList<Notification>> GetUnreadByUserIdAsync(int userId); // Get unread notifications by user ID
        Task<List<Notification>> SearchAsync(NotificationSearchCriteria? searchCriteria = null); // Search notifications
        Task AddAsync(Notification toCreate); // Add a new notification
        Task UpdateAsync(Notification toUpdate); // Update an existing notification
        Task DeleteAsync(Notification toDelete); // Delete a notification
    }
}
