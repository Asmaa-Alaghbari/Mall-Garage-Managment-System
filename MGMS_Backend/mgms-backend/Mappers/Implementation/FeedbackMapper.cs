using mgms_backend.DTO.FeedbackDTO;
using mgms_backend.Entities.Feedbacks;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps the Feedback entity to the FeedbackDTO and vice versa
    [Mapper]
    public partial class FeedbackMapper : IFeedbackMapper
    {
        public partial Feedback? ToModel(FeedbackDto? dto); // Convert DTO to model
        public partial FeedbackDto? ToDto(Feedback? model); // Convert model to DTO
        public partial FeedbackSearchCriteria? ToSearchCriteriaModel(FeedbackSearchCriteriaDto? dto); // Convert search criteria DTO to search criteria model
        public partial IList<FeedbackDto>? ToCollectionDto(IList<Feedback>? model); // Convert collection of models to collection of DTOs
        public partial IList<Feedback>? ToCollectionModel(IList<FeedbackDto>? dto); // Convert collection of DTOs to collection of models
    }
}
