using mgms_backend.DTO.NotificationDTO;
using mgms_backend.Entities.Notifications;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for Notification
    public interface INotificationMapper
    {
        public Notification? ToModel(NotificationDto? dto); // Convert NotificationDto to Notification
        public NotificationDto? ToDto(Notification? model); // Convert Notification to NotificationDto
        public NotificationSearchCriteria? ToSearchCriteriaModel(NotificationSearchCriteriaDto? dto); // Convert NotificationSearchCriteriaDto to NotificationSearchCriteria
        public IList<NotificationDto>? ToCollectionDto(IList<Notification>? model); // Convert a collection of Notification to a collection of NotificationDto
        public IList<Notification>? ToCollectionModel(IList<NotificationDto>? dto); // Convert a collection of NotificationDto to a collection of Notification
    }
}
