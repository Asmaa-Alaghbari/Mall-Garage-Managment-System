using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public FeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all feedbacks
        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        // Get feedback by id
        public async Task<Feedback> GetFeedbackByIdAsync(int id)
        {
            return await _context.Feedbacks.FindAsync(id);
        }

        // Add feedback
        public async Task AddFeedbackAsync(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
        }

        // Save changes
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // Delete feedback
        public async Task DeleteFeedbackAsync(int feedbackId)
        {
            var feedback = await _context.Feedbacks.FindAsync(feedbackId);
            if (feedback != null)
            {
                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }

        // Get feedback by user id
        public async Task<IEnumerable<Feedback>> GetFeedbackByUserIdAsync(int userId)
        {
            return await _context.Feedbacks.Where(f => f.UserId == userId).ToListAsync();
        }
    }
}
