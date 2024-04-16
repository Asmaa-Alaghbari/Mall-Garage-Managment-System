﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.Repositories;
using mgms_backend.Models;
using mgms_backend.DTO;

namespace mgms_backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackIdRepository;
        private readonly IUserRepository _userRepository;

        public FeedbacksController(IFeedbackRepository repository, IUserRepository userRepository)
        {
            _feedbackIdRepository = repository;
            _userRepository = userRepository;
        }

        // GET: api/Feedbacks/GetAllFeedbacks
        [HttpGet("GetAllFeedbacks")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            var feedbacks = await _feedbackIdRepository.GetAllFeedbacksAsync();
            return Ok(feedbacks);
        }

        // GET: api/Feedbacks/GetFeedbackById
        [HttpGet("GetFeedbackById")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Feedback>> GetFeedbackById(int feedbackId)
        {
            var feedback = await _feedbackIdRepository.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                return NotFound("Feedback not found!");
            }
            return Ok(feedback);
        }

        // POST: api/Feedbacks/AddFeedback
        [HttpPost("AddFeedback")]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult> AddFeedback(FeedbackDTO feedbackDTO)
        {
            var feedback = new Feedback
            {
                UserId = feedbackDTO.UserId,
                Message = feedbackDTO.Message,
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

            await _feedbackIdRepository.AddFeedbackAsync(feedback);
            await _feedbackIdRepository.SaveChangesAsync();

            return Ok(new { message = "Feedback added successfully!" });
        }
        
        // DELETE: api/Feedbacks/DeleteFeedback
        [HttpDelete("DeleteFeedback")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            var payment = await _feedbackIdRepository.GetFeedbackByIdAsync(feedbackId);
            if (payment == null)
            {
                return NotFound("Feedback not found!");
            }

            // Delete the Payment from the database
            await _feedbackIdRepository.DeleteFeedbackAsync(feedbackId);
            await _feedbackIdRepository.SaveChangesAsync();

            return Ok(new { message = $"Feedback with ID {feedbackId} deleted successfully!" });
        }
    }
}
