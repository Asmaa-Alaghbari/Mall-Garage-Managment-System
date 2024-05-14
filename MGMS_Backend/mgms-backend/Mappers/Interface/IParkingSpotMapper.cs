using mgms_backend.DTO.ParkingSpotDTO;
using mgms_backend.Entities.ParkingSpots;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for parking spot entities
    public interface IParkingSpotMapper
    {
        public ParkingSpot? ToModel(ParkingSpotDto? dto); // Convert DTO to model
        public ParkingSpotDto? ToDto(ParkingSpot? model); // Convert model to DTO
        public ParkingSpotSearchCriteria? ToSearchCriteriaModel(ParkingSpotSearchCriteriaDto? dto); // Convert search criteria DTO to model
        public IList<ParkingSpotDto>? ToCollectionDto(IList<ParkingSpot>? model); // Convert collection of models to collection of DTOs
    }
}
