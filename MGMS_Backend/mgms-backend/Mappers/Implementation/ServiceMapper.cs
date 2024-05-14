using mgms_backend.DTO.ServiceDTO;
using mgms_backend.Entities.Services;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps Service entities to Service DTOs and vice versa
    [Mapper]
    public partial class ServiceMapper : IServiceMapper
    {
        public partial Service? ToModel(ServiceDto? dto); // Maps Service DTO to Service entity
        public partial ServiceDto? ToDto(Service? model); // Maps Service entity to Service DTO
        public partial ServiceSearchCriteria? ToSearchCriteriaModel(ServiceSearchCriteriaDto? dto); // Maps ServiceSearchCriteria DTO to ServiceSearchCriteria entity
        public partial IList<ServiceDto>? ToCollectionDto(IList<Service>? model); // Maps a collection of Service entities to a collection of Service DTOs
        public partial IList<Service>? ToCollectionModel(IList<ServiceDto>? dto); // Maps a collection of Service DTOs to a collection of Service entities
    }
}
