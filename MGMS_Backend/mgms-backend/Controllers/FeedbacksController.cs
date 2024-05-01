using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.Repositories;
using mgms_backend.Models;
using mgms_backend.DTO;
using mgms_backend.Utilities;

namespace mgms_backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IUserRepository _userRepository;

        public FeedbacksController(IFeedbackRepository repository, IUserRepository userRepository)
        {
            _feedbackRepository = repository;
            _userRepository = userRepository;
        }

        // GET: api/Feedbacks/GetAllFeedbacks
        [HttpGet("GetAllFeedbacks")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            var feedbacks = await _feedbackRepository.GetAllFeedbacksAsync();
            return Ok(feedbacks);
        }

        // GET: api/Feedbacks/GetFeedbackById
        [HttpGet("GetFeedbackById")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Feedback>> GetFeedbackById(int feedbackId)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                return NotFound("Feedback not found!");
            }
            return Ok(feedback);
        }

        // GET: api/Feedbacks/GetFeedbackByUserId
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

            var feedbackDTOs = feedbacks.Select(f => new FeedbackDTO
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

        // POST: api/Feedbacks/AddFeedback
        [HttpPost("AddFeedback")]
        [Authorize]
        public async Task<ActionResult> AddFeedback(FeedbackDTO feedbackDTO)
        {
            var feedback = new Feedback
            {
                UserId = feedbackDTO.UserId,
                Message = feedbackDTO.Message,
                Rating = feedbackDTO.Rating,
                FeedbackType = feedbackDTO.FeedbackType,
                IsAnonymous = feedbackDTO.IsAnonymous,
                DateTime = DateTime.UtcNow
            };

            // Check if UserId is provided
            if (feedbackDTO.UserId <= 0)
            {
                return BadRequest("UserId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(feedbackDTO.UserId);
            if (userExists == null)
            {
                return NotFound($"User with ID {feedbackDTO.UserId} not found!");
            }

            // Check if the message is empty
            if (string.IsNullOrWhiteSpace(feedback.Message))
            {
                return StatusCode(422, "Message cannot be empty!");
            }

            await _feedbackRepository.AddFeedbackAsync(feedback);
            await _feedbackRepository.SaveChangesAsync();

            return Ok(new { message = "Feedback added successfully!" });
        }

        // DELETE: api/Feedbacks/DeleteFeedback
        [HttpDelete("DeleteFeedback")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            var payment = await _feedbackRepository.GetFeedbackByIdAsync(feedbackId);
            if (payment == null)
            {
                return NotFound("Feedback not found!");
            }

            // Delete the Payment from the database
            await _feedbackRepository.DeleteFeedbackAsync(feedbackId);
            await _feedbackRepository.SaveChangesAsync();

            return Ok(new { message = $"Feedback with ID {feedbackId} deleted successfully!" });
        }
    }
}
