using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.ReservationDTO;
using mgms_backend.Exceptions;
using mgms_backend.Helpers;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IParkingSpotRepository _parkingSpotRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IReservationMapper _reservationMapper;
        private readonly IUserHelper _userHelper;

        public ReservationsController(
            IParkingSpotRepository parkingSpotRepository,
            IReservationRepository reservationRepository,
            IUserRepository userRepository,
            IReservationMapper reservationMapper,
            IUserHelper userHelper)
        {
            _parkingSpotRepository = parkingSpotRepository;
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _reservationMapper = reservationMapper;
            _userHelper = userHelper;
        }

        // GET: api/GetAllReservations: Get all reservations
        [HttpGet("GetAllReservations")]
        [Authorize]
        public async Task<ActionResult> GetAllReservations()
        {
            var reservations = await _reservationRepository.GetAllReservationsAsync();
            return Ok(reservations);
        }

        // GET: api/GetReservationById: Get reservation by ID
        [HttpGet("GetReservationById")]
        [Authorize]
        public async Task<ActionResult> GetReservationById(int reservationId)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);

            // Check if the reservation exists
            if (reservation == null)
            {
                throw new EntityNotFoundException("Reservation not found!");
            }
            return Ok(reservation);
        }

        // GET: api/GetReservationsByParkingSpotId: Get reservations by parking spot ID
        [HttpGet("GetReservationsByParkingSpotId")]
        [Authorize]
        public async Task<ActionResult> GetReservationsByParkingSpotId(int parkingSpotId)
        {
            // Check if the parking spot exists
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                throw new EntityNotFoundException($"No parking spot found with ID {parkingSpotId}.");
            }

            var reservations = await _reservationRepository.GetReservationsByParkingSpotIdAsync(parkingSpotId);
            var reservationDTOs = reservations.Select(r => new ReservationDto
            {
                ReservationId = r.ReservationId,
                UserId = r.UserId,
                ParkingSpotNumber = r.ParkingSpot.Number,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                Status = r.Status
            }).ToList();

            // If no reservations are found, return a 404 Not Found
            if (reservations == null || !reservations.Any())
            {
                throw new EntityNotFoundException("No reservations found for the specified parking spot ID.");
            }

            return Ok(reservationDTOs);
        }

        // GET: api/GetReservationByUserId: Get reservation by user ID
        [HttpGet("GetReservationsByUserId")]
        [Authorize]
        public async Task<ActionResult> GetReservationsByUserId([FromQuery] int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (ReferenceEquals(null, user))
            {
                throw new EntityNotFoundException($"Parking spots: User with id {userId} was not found!");
            }

            var reservations = await _reservationRepository.GetReservationsByUserId(userId);

            return Ok(_reservationMapper.ToCollectionDto(reservations));
        }

        // GET: api/GetReservationStatistics: Get Reservation Statistics
        [HttpGet("GetReservationStatistics")]
        [Authorize]
        public async Task<ActionResult> GetReservationStatistics()
        {
            var reservations = await _reservationRepository.GetAllReservationsAsync();
            if (reservations == null || !reservations.Any())
            {
                return Ok(new { message = "No reservations found!" });
            }

            var totalReservations = reservations.Count();
            var totalActiveReservations = reservations.Count(f => f.Status == "Active");
            var totalApprovedReservations = reservations.Count(f => f.Status == "Approved");
            var totalCancelledReservations = reservations.Count(f => f.Status == "Cancelled");
            var totalCompletedReservations = reservations.Count(f => f.Status == "Completed");
            var totalPendingReservations = reservations.Count(f => f.Status == "Pending");

            return Ok(new
            {
                totalReservations,
                totalActiveReservations,
                totalApprovedReservations,
                totalCancelledReservations,
                totalCompletedReservations,
                totalPendingReservations
            });
        }

        // POST: api/AddReservation: Add a new reservation
        [HttpPost("AddReservation")]
        [Authorize]
        public async Task<ActionResult> AddReservation([FromBody] ReservationDto createReservationDto)
        {
            // Convert DateTime to UTC if necessary to avoid timezone issues when storing in the database
            createReservationDto.StartTime = createReservationDto.StartTime.ToUniversalTime();
            createReservationDto.EndTime = createReservationDto.EndTime.ToUniversalTime();

            // Check if UserId and ParkingSpotId are provided and valid
            if (createReservationDto.UserId <= 0 || createReservationDto.ParkingSpotNumber <= 0)
            {
                throw new ServerValidationException("UserId and ParkingSpotNumber must be provided!");
            }

            // Check for the existence of the user
            var user = await _userRepository.GetUserByIdAsync(createReservationDto.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"User with ID {createReservationDto.UserId} not found.");
            }

            // Check for the existence of the parking spot
            var parkingSpot =
                await _parkingSpotRepository.GetParkingSpotByNumberAsync(createReservationDto.ParkingSpotNumber);
            if (parkingSpot == null)
            {
                throw new EntityNotFoundException($"Parking spot with number {createReservationDto.ParkingSpotNumber} not found!");
            }

            var newReservation = _reservationMapper.MapToModel(createReservationDto);
            newReservation.ParkingSpotId = parkingSpot.ParkingSpotId;

            // Check if the reservation is valid (e.g. start time is before end time) before adding it
            if (newReservation.StartTime >= newReservation.EndTime)
            {
                throw new ServerValidationException("Start time must be before end time");
            }

            // Check if the parking spot is available for the given time range before adding the reservation
            bool isSpotAvailable = await _reservationRepository.IsParkingSpotAvailableAsync(newReservation.ParkingSpotId, 0, newReservation.StartTime, newReservation.EndTime);
            if (!isSpotAvailable)
            {
                throw new ServerValidationException("Parking spot is not available for the given time range.");
            }

            await _reservationRepository.AddReservationAsync(newReservation);
            await _reservationRepository.SaveChangesAsync();

            return Ok(new { message = "Reservation added successfully!" });
        }

        // POST: api/SearchPaginated: Search for reservations with pagination
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber, [FromQuery] int pageSize,
            [FromBody] ReservationSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _reservationMapper.ToSearchCriteriaModel(searchCriteria);
            searchCriteriaModel.UserId = await _userHelper.GetUserIdForSearchCriteria(User.Identity);

            var fetchedResults = await _reservationRepository.SearchAsync(searchCriteriaModel);
            var totalRecords = fetchedResults.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { TotalPages = totalPages, Data = _reservationMapper.MapToCollectionDto(paginatedData) });
        }

        // PUT: api/UpdateReservation: Update an existing reservation
        [HttpPut("UpdateReservation")]
        [Authorize]
        public async Task<IActionResult> UpdateReservation(int reservationId, [
            FromBody] ReservationDto updateReservationDto)
        {
            // Convert DateTime to UTC if necessary to avoid timezone issues when storing in the database
            updateReservationDto.StartTime = updateReservationDto.StartTime.ToUniversalTime();
            updateReservationDto.EndTime = updateReservationDto.EndTime.ToUniversalTime();

            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);
            if (reservation == null)
            {
                throw new EntityNotFoundException("Reservation not found!");
            }

            // Check if the reservation is valid (e.g. start time is before end time) before updating it
            if (updateReservationDto.StartTime >= updateReservationDto.EndTime)
            {
                throw new ServerValidationException("Start time must be before end time");
            }

            // Check if the start time and end time are in the future
            if (updateReservationDto.StartTime < DateTime.UtcNow || updateReservationDto.EndTime < DateTime.UtcNow)
            {
                throw new ServerValidationException("Start time and End time must be in the future");
            }

            // Check if StartTime, EndTime, or Status has changed
            bool datesChanged = reservation.StartTime != updateReservationDto.StartTime ||
                                reservation.EndTime != updateReservationDto.EndTime;

            // Check if the status has changed
            bool statusChanged = reservation.Status != updateReservationDto.Status;

            // If time is not changed, set it back to the original values
            if (!datesChanged)
            {
                updateReservationDto.StartTime = reservation.StartTime;
                updateReservationDto.EndTime = reservation.EndTime;
            }

            if (datesChanged || statusChanged)
            {
                // Check if the parking spot is available for the given time range
                bool isSpotAvailable = await _reservationRepository.IsParkingSpotAvailableAsync(
                    reservation.ParkingSpotId, reservation.ReservationId, updateReservationDto.StartTime, updateReservationDto.EndTime);

                if (!isSpotAvailable)
                {
                    throw new ServerValidationException("Parking spot is not available for the given time range.");
                }
            }

            var parkingSpot =
                await _parkingSpotRepository.GetParkingSpotByNumberAsync(updateReservationDto.ParkingSpotNumber);

            if (ReferenceEquals(null, parkingSpot))
            {
                throw new ServerValidationException(
                    $"Parking spot with number {updateReservationDto.ParkingSpotNumber} was not found!");
            }

            // Update the reservation with the new values
            reservation.ParkingSpotId = parkingSpot.ParkingSpotId;
            reservation.StartTime = updateReservationDto.StartTime;
            reservation.EndTime = updateReservationDto.EndTime;
            reservation.Status = updateReservationDto.Status;

            await _reservationRepository.UpdateReservationAsync(reservation);
            return Ok(new { message = "Reservation updated successfully!" });
        }

        // DELETE: api/DeleteReservation: Delete a reservation
        [HttpDelete("DeleteReservation")]
        public async Task<IActionResult> DeleteReservation([FromQuery] int reservationId)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);
            if (reservation == null)
            {
                throw new EntityNotFoundException("Reservation not found!");
            }

            // Delete the reservation from the database
            await _reservationRepository.DeleteReservationAsync(reservationId);

            return Ok(new { message = $"Reservation with ID {reservationId} deleted successfully!" });
        }
    }
}
