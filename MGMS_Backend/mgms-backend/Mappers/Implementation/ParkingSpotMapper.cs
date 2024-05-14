using mgms_backend.DTO.ParkingSpotDTO;
using mgms_backend.Entities.ParkingSpots;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps ParkingSpotDTO to ParkingSpot and vice versa
    [Mapper]
    public partial class ParkingSpotMapper : IParkingSpotMapper
    {
        public partial ParkingSpot? ToModel(ParkingSpotDto? dto); // Mapping DTO to model
        public partial ParkingSpotDto? ToDto(ParkingSpot? model); // Mapping model to DTO
        public partial ParkingSpotSearchCriteria ToSearchCriteriaModel(ParkingSpotSearchCriteriaDto? dto); // Mapping search criteria DTO to model
        public partial IList<ParkingSpotDto>? ToCollectionDto(IList<ParkingSpot>? model); // Mapping collection of models to collection of DTOs
    }
}
