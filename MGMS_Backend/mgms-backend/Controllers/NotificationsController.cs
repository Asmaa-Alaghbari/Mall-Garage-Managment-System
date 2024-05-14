using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.NotificationDTO;
using mgms_backend.Entities.Notifications;
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
        private readonly INotificationRepository _notificationRepository;
        private readonly INotificationMapper _notificationMapper;
        private readonly IUserHelper _userHelper;

        public NotificationsController(INotificationRepository notificationRepository, INotificationMapper notificationMapper, IUserHelper userHelper)
        {
            _notificationRepository = notificationRepository;
            _notificationMapper = notificationMapper;
            _userHelper = userHelper;
        }

        // GET: api/GetNotificationsStatistics: Get the statistics of notifications
        [HttpGet("GetNotificationsStatistics")]
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
        public async Task<IActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
        {
            var newNotification = _notificationMapper.ToModel(notificationDto);

            // Validate if the notification is assigned to a user
            if (notificationDto.UserId.Equals(default))
            {
                throw new ServerValidationException("The notification must be assigned to a user!");
            }

            await _notificationRepository.AddAsync(newNotification);

            return Ok(new { message = $"Service with Id {newNotification.NotificationId} created successfully!" });
        }

        // POST: api/AddNotification: Add a new notification
        [HttpPost("DeleteNotification")]
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

        // PUT: api/MarkAsRead: Mark a notification as read
        [HttpPut("MarkAsRead")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead([FromQuery] int notificationId)
        {
            var notification = await _notificationRepository.GetByNotificationIdAsync(notificationId);

            // Check if the notification exists
            if (ReferenceEquals(null, notification))
            {
                throw new EntityNotFoundException($"Notification with Id {notificationId} was not found!");
            }

            notification.IsRead = true;
            await _notificationRepository.UpdateAsync(notification);

            return Ok(new { Message = $"Notification with Id {notificationId} was marked as read!" });
        }
    }
}
