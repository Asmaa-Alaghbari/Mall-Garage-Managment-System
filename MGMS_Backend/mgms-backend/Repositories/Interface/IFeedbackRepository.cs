using mgms_backend.Entities.Feedbacks;

namespace mgms_backend.Repositories
{
    public interface IFeedbackRepository
    {
        Task<Feedback> GetFeedbackByIdAsync(int feedbackId); // Get feedback by id
        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync(); // Get all feedbacks
        Task<IEnumerable<Feedback>> GetFeedbackByUserIdAsync(int userId); // Get feedback by user id
        Task<IEnumerable<Feedback>> GetFeedbacksAsync(int pageNumber, int pageSize); // Get feedbacks with pagination
        Task<IEnumerable<Feedback>> SearchAsync(FeedbackSearchCriteria? searchCriteria); // Search feedbacks
        Task AddFeedbackAsync(Feedback feedbackId); // Add feedback
        Task DeleteFeedbackAsync(int feedbackId); // Delete feedback
        Task SaveChangesAsync(); // Save changes
    }
}
