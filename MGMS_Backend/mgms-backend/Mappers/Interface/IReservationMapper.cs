using mgms_backend.DTO.ReservationDTO;
using mgms_backend.Entities.Reservations;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for Reservation
    public interface IReservationMapper
    {
        public Reservation? ToModel(ReservationDto? dto); // Convert ReservationDto to Reservation
        public Reservation? MapToModel(ReservationDto? dto); // Map ReservationDto to Reservation
        public ReservationDto? ToDto(Reservation? model); // Convert Reservation to ReservationDto
        public ReservationDto? MapToDto(Reservation? model); // Map Reservation to ReservationDto
        public ReservationSearchCriteria? ToSearchCriteriaModel(ReservationSearchCriteriaDto? dto); // Convert ReservationSearchCriteriaDto to ReservationSearchCriteria
        public IList<ReservationDto>? ToCollectionDto(IList<Reservation>? model); // Convert a collection of Reservation to a collection of ReservationDto
        public IList<Reservation>? ToCollectionModel(IList<ReservationDto>? dto); // Convert a collection of ReservationDto to a collection of Reservation
        IList<ReservationDto>? MapToCollectionDto(IList<Reservation>? modelCollection); // Map a collection of Reservation to a collection of ReservationDto
    }
}
