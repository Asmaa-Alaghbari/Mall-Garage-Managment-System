using mgms_backend.DTO.FeedbackDTO;
using mgms_backend.Entities.Feedbacks;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for Feedback entity
    public interface IFeedbackMapper
    {
        public Feedback? ToModel(FeedbackDto? dto); // Convert FeedbackDto to Feedback
        public FeedbackDto? ToDto(Feedback? model); // Convert Feedback to FeedbackDto
        public FeedbackSearchCriteria? ToSearchCriteriaModel(FeedbackSearchCriteriaDto? dto); // Convert FeedbackSearchCriteriaDto to FeedbackSearchCriteria
        public IList<FeedbackDto>? ToCollectionDto(IList<Feedback>? model); // Convert list of Feedback to list of FeedbackDto
        public IList<Feedback>? ToCollectionModel(IList<FeedbackDto>? dto); // Convert list of FeedbackDto to list of Feedback
    }
}

