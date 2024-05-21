using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.FeedbackDTO;
using mgms_backend.Entities.Feedbacks;
using mgms_backend.Exceptions;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFeedbackMapper _feedbackMapper;

        public FeedbacksController(
            IFeedbackRepository repository,
            IUserRepository userRepository,
            IFeedbackMapper feedbackMapper)
        {
            _feedbackRepository = repository;
            _userRepository = userRepository;
            _feedbackMapper = feedbackMapper;
        }

        // GET: api/Feedbacks/GetAllFeedbacks: Get all feedbacks
        [HttpGet("GetAllFeedbacks")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            var feedbacks = await _feedbackRepository.GetAllFeedbacksAsync();
            return Ok(feedbacks);
        }

        // GET: api/Feedbacks/GetFeedbackById: Get feedback by ID
        [HttpGet("GetFeedbackById")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Feedback>> GetFeedbackById(int feedbackId)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new EntityNotFoundException("Feedback not found!");
            }
            return Ok(feedback);
        }

        // GET: api/Feedbacks/GetFeedbackByUserId: Get feedbacks by User ID
        [HttpGet("GetFeedbackByUserId")]
        [Authorize(Roles = "ADMIN, USER")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbackByUserId([FromQuery] int userId)
        {
            // Check if UserId is provided
            if (userId <= 0)
            {
                return BadRequest("UserId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(userId);
            if (userExists == null)
            {
                return NotFound($"User with ID {userId} not found!");
            }

            // Return an empty list result when no feedbacks are found
            var feedbacks = await _feedbackRepository.GetFeedbackByUserIdAsync(userId);
            if (feedbacks == null || !feedbacks.Any())
            {
                var emptyFeedbackList = new List<Feedback>();
                return Ok(new { message = "Feedbacks not found for the user!", emptyFeedbackList }); // Return an empty list
            }

            var feedbackDTOs = feedbacks.Select(f => new FeedbackDto
            {
                FeedbackId = f.FeedbackId,
                UserId = f.UserId,
                Message = f.Message,
                Rating = f.Rating,
                FeedbackType = f.FeedbackType,
                IsAnonymous = f.IsAnonymous,
                DateTime = f.DateTime
            }).ToList();

            return Ok(feedbackDTOs);
        }

        // GET: api/Feedbacks/GetFeedbackStatistics: Get feedback statistics
        [HttpGet("GetFeedbackStatistics")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> GetFeedbackStatistics()
        {
            var feedbacks = await _feedbackRepository.GetAllFeedbacksAsync();
            if (feedbacks == null || !feedbacks.Any())
            {
                return Ok(new { message = "No feedbacks found!" });
            }

            var totalFeedbacks = feedbacks.Count();
            var totalPositiveFeedbacks = feedbacks.Count(f => f.Rating >= 3);
            var totalNegativeFeedbacks = feedbacks.Count(f => f.Rating < 2);
            var totalAnonymousFeedbacks = feedbacks.Count(f => f.IsAnonymous);
            var averageRating = feedbacks.Average(f => f.Rating);

            return Ok(new
            {
                totalFeedbacks,
                totalPositiveFeedbacks,
                totalNegativeFeedbacks,
                totalAnonymousFeedbacks,
                averageRating
            });
        }

        // POST: api/Feedbacks/AddFeedback: Add feedback
        [HttpPost("AddFeedback")]
        [Authorize]
        public async Task<ActionResult> AddFeedback(FeedbackDto feedbackDTO)
        {
            var feedback = _feedbackMapper.ToModel(feedbackDTO);

            // Check if UserId is provided
            if (feedbackDTO.UserId <= 0)
            {
                throw new ServerValidationException("UserId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(feedbackDTO.UserId);
            if (userExists == null)
            {
                throw new EntityNotFoundException($"User with ID {feedbackDTO.UserId} not found!");
            }

            // Check if the message is empty
            if (string.IsNullOrWhiteSpace(feedback.Message))
            {
                throw new ServerValidationException("Message cannot be empty!");
            }

            feedback.DateTime = DateTime.UtcNow;

            await _feedbackRepository.AddFeedbackAsync(feedback);
            await _feedbackRepository.SaveChangesAsync();

            return Ok(new { message = "Feedback added successfully!" });
        }

        // POST: api/SearchPaginated: Search feedbacks with pagination
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber,
            [FromQuery] int pageSize, [FromBody] FeedbackSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _feedbackMapper.ToSearchCriteriaModel(searchCriteria);
            var fetchedResults = await _feedbackRepository.SearchAsync(searchCriteriaModel);
            var totalRecords = fetchedResults.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();

            return Ok(new { TotalPages = totalPages, Data = _feedbackMapper.ToCollectionDto(paginatedData) });
        }

        // DELETE: api/Feedbacks/DeleteFeedback: Delete feedback by ID
        [HttpDelete("DeleteFeedback")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new EntityNotFoundException("Feedback not found!");
            }

            // Delete the Payment from the database
            await _feedbackRepository.DeleteFeedbackAsync(feedbackId);
            await _feedbackRepository.SaveChangesAsync();

            return Ok(new { message = $"Feedback with ID {feedbackId} deleted successfully!" });
        }
    }
}
