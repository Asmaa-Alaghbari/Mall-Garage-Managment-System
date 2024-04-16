using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync(); // Get all feedbacks
        Task<Feedback> GetFeedbackByIdAsync(int feedbackId); // Get feedback by id
        Task<IEnumerable<Feedback>> GetFeedbackByUserIdAsync(int userId); // Get feedback by user id
        Task AddFeedbackAsync(Feedback feedbackId); // Add feedback
        Task SaveChangesAsync(); // Save changes
        Task DeleteFeedbackAsync(int feedbackId); // Delete feedback

    }
}
