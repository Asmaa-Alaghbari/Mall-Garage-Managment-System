using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using mgms_backend.DTO.NotificationDTO;
using mgms_backend.Entities.Notifications;
using mgms_backend.Entities.Reservations;
using mgms_backend.Exceptions;
using mgms_backend.Helpers;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    [Authorize] // Secure the controller with JWT authentication
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationMapper _notificationMapper;
        private readonly INotificationRepository _notificationRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserHelper _userHelper;

        public NotificationsController(
            INotificationMapper notificationMapper,
            INotificationRepository notificationRepository,
            IReservationRepository reservationRepository,
            IUserRepository userRepository,
            IUserHelper userHelper)
        {
            _notificationMapper = notificationMapper;
            _notificationRepository = notificationRepository;
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _userHelper = userHelper;
        }

        // GET: api/GetNotificationsStatistics: Get the statistics of notifications
        [HttpGet("GetNotificationsStatistics")]
        [Authorize]
        public async Task<IActionResult> GetNotificationsStatistics([FromQuery] int userId = 0)
        {
            IList<Notification> notifications;

            // Check if the user Id is provided
            if (userId != 0)
            {
                notifications = await _notificationRepository.GetByUserIdAsync(userId);
            }
            else
            {
                notifications = await _notificationRepository.GetAllAsync();
            }

            return Ok(new
            {
                Total = notifications?.Count() ?? 0,
                Unread = notifications?.Count(x => !x.IsRead) ?? 0,
            });
        }

        // POST: api/AddNotification: Add a new notification
        [HttpPost("AddNotification")]
        [Authorize]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
        {
            var newNotification = _notificationMapper.ToModel(notificationDto);

            // Validate if the notification is assigned to a user
            if (notificationDto.UserId.Equals(default))
            {
                throw new ServerValidationException("The notification must be assigned to a user!");
            }

            // Check if the reservation exists for the notification 
            if (notificationDto.ReservationId.HasValue)
            {
                var reservation = _reservationRepository.GetReservationByIdAsync(notificationDto.ReservationId.Value);

                if (ReferenceEquals(null, reservation) && notificationDto.ReservationId != 0)
                {
                    throw new ServerValidationException("The reservation for this notification does not exist!");
                }
            }

            newNotification.NotificationId = 0;
            await _notificationRepository.AddAsync(newNotification);

            return Ok(new
            {
                message = $"Notification with Id {newNotification.NotificationId} created successfully!"
            });
        }

        // POST: api/AddNotificationForRole: Add a new notification for a role
        [HttpPost("AddNotificationForRole")]
        public async Task<IActionResult> CreateNotificationForRole([FromQuery] string role, [FromBody] NotificationDto notificationDto)
        {
            var newNotification = _notificationMapper.ToModel(notificationDto);
            var users = await _userRepository.GetUsersByRoleAsync(role);
            Reservation? reservation = null;

            // Check if the notification is assigned to a user
            if (notificationDto.ReservationId.HasValue)
            {
                reservation = await _reservationRepository.GetReservationByIdAsync(notificationDto.ReservationId.Value);
            }

            // Check if the role exists
            if (users.IsNullOrEmpty())
            {
                return Ok();
            }

            // Check if the reservation exists for the notification
            if (ReferenceEquals(null, reservation) && notificationDto.ReservationId != 0)
            {
                throw new ServerValidationException("The reservation for this notification does not exist!");
            }

            // Add the notification for each user in the role
            foreach (var user in users)
            {
                newNotification.NotificationId = 0;
                newNotification.UserId = user.UserId;

                await _notificationRepository.AddAsync(newNotification);
            }

            return Ok(new { message = $"Notifications sent to role \"{role}\"." });
        }

        // POST: api/AddNotification: Add a new notification
        [HttpPost("DeleteNotification")]
        [Authorize]
        public async Task<IActionResult> DeleteNotification([FromQuery] int notificationId)
        {
            var notification = await _notificationRepository.GetByNotificationIdAsync(notificationId);

            // Check if the notification exists
            if (ReferenceEquals(null, notification))
            {
                throw new EntityNotFoundException($"The notification with Id {notificationId} does not exist!");
            }

            await _notificationRepository.DeleteAsync(notification);

            return Ok(new { message = $"Notification with Id {notificationId} deleted successfully!" });
        }

        // POST: api/SearchPaginated: Search for notifications with pagination
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromBody] NotificationSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _notificationMapper.ToSearchCriteriaModel(searchCriteria);
            searchCriteriaModel.UserId = await _userHelper.GetUserIdForSearchCriteria(User.Identity);
            var fetchedResults = await _notificationRepository.SearchAsync(searchCriteriaModel);
            var totalRecords = fetchedResults.Count;
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
            .Take(pageSize).ToList();

            return Ok(new { TotalPages = totalPages, Data = _notificationMapper.ToCollectionDto(paginatedData) });
        }

        // PUT: api/MarkAsReadOrUnread: Mark a notification as read or unread
        [HttpPut("MarkAsReadOrUnread")]
        [Authorize]
        public async Task<IActionResult> MarkAsReadOrUnread([FromQuery] int notificationId)
        {
            var notification = await _notificationRepository.GetByNotificationIdAsync(notificationId);

            // Check if the notification exists
            if (notification == null)
            {
                throw new EntityNotFoundException($"Notification with Id {notificationId} was not found!");
            }

            // Toggle the IsRead property
            notification.IsRead = !notification.IsRead;
            await _notificationRepository.UpdateAsync(notification);

            string message = notification.IsRead ?
                             $"Notification with Id {notificationId} was marked as read!" :
                             $"Notification with Id {notificationId} was marked as unread!";

            return Ok(new { Message = message });
        }
    }
}
