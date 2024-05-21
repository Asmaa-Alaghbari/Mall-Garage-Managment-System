using mgms_backend.DTO.ReservationDTO;
using mgms_backend.Entities.Reservations;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;
using Reservation = mgms_backend.Entities.Reservations.Reservation;

namespace mgms_backend.Mappers.Implementation
{
    // Maps Reservation entities to Reservation DTOs and vice versa
    [Mapper]
    public partial class ReservationMapper : IReservationMapper
    {
        public partial Reservation? ToModel(ReservationDto? dto); // Maps Reservation DTO to Reservation entity
        public partial ReservationDto? ToDto(Reservation? model); // Maps Reservation entity to Reservation DTO
        public partial ReservationSearchCriteria ToSearchCriteriaModel(ReservationSearchCriteriaDto? dto); // Maps ReservationSearchCriteria DTO to ReservationSearchCriteria entity
        public partial IList<ReservationDto>? ToCollectionDto(IList<Reservation>? model); // Maps a collection of Reservation entities to a collection of Reservation DTOs
        public partial IList<Reservation>? ToCollectionModel(IList<ReservationDto>? dto); // Maps a collection of Reservation DTOs to a collection of Reservation entities

        // Maps Reservation DTO to Reservation entity and adds the service IDs to the Reservation entity
        [UserMapping(Default = true)]
        public Reservation? MapToModel(ReservationDto? dto)
        {
            var reservationModel = ToModel(dto);

            // Check if the Reservation DTO is null
            if (ReferenceEquals(null, reservationModel))
            {
                return reservationModel;
            }

            // Add the service IDs to the Reservation entity
            reservationModel.Services = dto.ServiceIds.Select(x => new ReservationService
            {
                ServiceId = x
            }).ToList();
            return reservationModel;
        }

        // Maps a collection of Reservation DTOs to a collection of Reservation entities and adds the service IDs to the Reservation entities
        [UserMapping(Default = true)]
        public ReservationDto? MapToDto(Reservation? model)
        {
            var reservationDto = ToDto(model);
            reservationDto.ServiceIds = model.Services.Select(x => x.ServiceId).ToArray();

            return reservationDto;
        }

        // Maps a collection of Reservation entities to a collection of Reservation DTOs and adds the service IDs to the Reservation DTOs
        [UserMapping(Default = true)]
        public IList<ReservationDto>? MapToCollectionDto(IList<Reservation>? modelCollection)
        {
            var reservationDtos = new List<ReservationDto>();

            foreach (var reservation in modelCollection)
            {
                var reservationDto = ToDto(reservation);

                reservationDto.ServiceIds = reservation.Services.Select(x => x.ServiceId).ToArray();
                reservationDtos.Add(reservationDto);
            }

            return reservationDtos;
        }
    }
}
