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

        // Mapping DTO to model and adding the time left to reservation
        [UserMapping(Default = true)]
        public IList<NotificationDto>? MapToCollectionDto(IList<Notification>? model)
        {
            var notificationDtos = new List<NotificationDto>();

            foreach (var notification in model)
            {
                var notificationDto = ToDto(notification);

                // Check if the Reservation is not null
                if (!ReferenceEquals(null, notification.Reservation))
                {
                    notificationDto.TimeLeftToReservation =
                        GetFormattedTimeRemaining(DateTime.Now, notification.Reservation.StartTime);
                }

                notificationDtos.Add(notificationDto);
            }

            return notificationDtos;
        }

        // Method to get the formatted time remaining between two dates
        private static string GetFormattedTimeRemaining(DateTime startDate, DateTime endDate)
        {
            // Convert both start and end dates to UTC to ensure consistent time zone handling
            startDate = startDate.ToUniversalTime();
            endDate = endDate.ToUniversalTime();

            var difference = endDate - startDate;

            // Check if the difference is greater than or equal to 1 day
            if (difference.TotalDays >= 1)
            {
                var days = (int)difference.TotalDays;
                return $"{days} day{(days > 1 ? "s" : "")}";
            }

            // Check if the difference is greater than or equal to 1 hour
            if (difference.TotalHours >= 1)
            {
                var hours = (int)difference.Hours;
                return $"{hours} hour{(hours > 1 ? "s" : "")}";
            }

            var minutes = (int)difference.TotalMinutes;

            return $"{minutes} minute{(minutes > 1 ? "s" : "")}";
        }
    }
}
