using mgms_backend.DTO.NotificationDTO;
using mgms_backend.Entities.Notifications;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps NotificationDTO to Notification and vice versa
    [Mapper]
    public partial class NotificationMapper : INotificationMapper
    {
        public partial Notification? ToModel(NotificationDto? dto); // Mapping DTO to model
        public partial NotificationDto? ToDto(Notification? model); // Mapping model to DTO
        public partial NotificationSearchCriteria? ToSearchCriteriaModel(NotificationSearchCriteriaDto? dto); // Mapping search criteria DTO to model
        public partial IList<NotificationDto>? ToCollectionDto(IList<Notification>? model); // Mapping collection of models to collection of DTOs
        public partial IList<Notification>? ToCollectionModel(IList<NotificationDto>? dto); // Mapping collection of DTOs to collection of models
    }
}
