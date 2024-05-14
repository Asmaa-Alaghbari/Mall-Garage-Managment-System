using mgms_backend.Data;
using mgms_backend.Entities.Feedbacks;
using mgms_backend.Extensions;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories.Implementation
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public FeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get feedback by id
        public async Task<Feedback> GetFeedbackByIdAsync(int id)
        {
            return await _context.Feedbacks.FindAsync(id);
        }

        // Get all feedbacks
        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        // Get feedback by user id
        public async Task<IEnumerable<Feedback>> GetFeedbackByUserIdAsync(int userId)
        {
            return await _context.Feedbacks.Where(f => f.UserId == userId).ToListAsync();
        }

        // Get feedbacks with pagination
        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync(int pageNumber, int pageSize)
        {
            return await _context.Feedbacks.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        // Search feedbacks with search criteria
        public async Task<IEnumerable<Feedback>> SearchAsync(FeedbackSearchCriteria? searchCriteria)
        {
            // Check if search criteria is null
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Feedbacks.ToListAsync();
            }

            // Query feedbacks based on search criteria
            var query = _context.Feedbacks.AsQueryable();
            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.UserId.ToString().Contains(searchCriteria.Text) ||
                    x.Rating.ToString().Contains(searchCriteria.Text) ||
                    x.FeedbackType.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.DateTime.ToString().Contains(searchCriteria.Text.ToLower()));
            }

            // Filter feedbacks based on search criteria
            if (!string.IsNullOrEmpty(searchCriteria.Type))
            {
                query = query.Where(x => x.FeedbackType.ToLower().Equals(searchCriteria.Type.ToLower()));
            }

            // Check if date has value
            if (searchCriteria.Date.HasValue)
            {
                query = query.Where(x =>
                    x.DateTime.Day.Equals(searchCriteria.Date.Value.Day) &&
                    x.DateTime.Month.Equals(searchCriteria.Date.Value.Month) &&
                    x.DateTime.Year.Equals(searchCriteria.Date.Value.Year));
            }

            // Check if rating is not default
            if (searchCriteria.Rating != default)
            {
                query = query.Where(x => x.Rating.Equals(searchCriteria.Rating));
            }

            // Check if user id is not default
            if (searchCriteria.UserId != default)
            {
                query = query.Where(x => x.UserId.Equals(searchCriteria.UserId));
            }

            // Check if sort by property is not null or empty
            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                query = query.OrderByDynamic(searchCriteria.SortByProperty);
            }

            return await query.ToListAsync();
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
    }
}
