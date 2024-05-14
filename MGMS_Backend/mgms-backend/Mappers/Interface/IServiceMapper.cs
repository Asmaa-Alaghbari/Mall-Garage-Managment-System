using mgms_backend.DTO.ServiceDTO;
using mgms_backend.Entities.Services;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for the Service entity
    public interface IServiceMapper
    {
        public Service? ToModel(ServiceDto? dto); // Convert ServiceDto to Service
        public ServiceDto? ToDto(Service? model); // Convert Service to ServiceDto
        public ServiceSearchCriteria? ToSearchCriteriaModel(ServiceSearchCriteriaDto? dto); // Convert ServiceSearchCriteriaDto to ServiceSearchCriteria
        public IList<ServiceDto>? ToCollectionDto(IList<Service>? model); // Convert a collection of Service to a collection of ServiceDto
        public IList<Service>? ToCollectionModel(IList<ServiceDto>? dto); // Convert a collection of ServiceDto to a collection of Service
    }
}
