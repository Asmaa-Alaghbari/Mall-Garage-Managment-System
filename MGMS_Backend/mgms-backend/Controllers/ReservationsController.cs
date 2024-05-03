using mgms_backend.DTO;
using mgms_backend.Models;
using mgms_backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IParkingSpotRepository _parkingSpotRepository;

        public ReservationsController(
            IReservationRepository reservationRepository,
            IUserRepository userRepository,
            IParkingSpotRepository parkingSpotRepository
            )
        {
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _parkingSpotRepository = parkingSpotRepository;
        }

        // GET: api/GetAllReservations
        [HttpGet("GetAllReservations")]
        [Authorize]
        public async Task<ActionResult> GetAllReservations()
        {
            var reservations = await _reservationRepository.GetAllReservationsAsync();
            return Ok(reservations);
        }

        // GET: api/GetReservationById
        [HttpGet("GetReservationById")]
        [Authorize]
        public async Task<ActionResult> GetReservationById(int reservationId)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);

            // If the reservation is not found, return a 404 Not Found
            if (reservation == null)
            {
                return NotFound("Reservation not found!");
            }
            return Ok(reservation);
        }

        // GET: api/GetReservationsByParkingSpotId
        [HttpGet("GetReservationsByParkingSpotId")]
        [Authorize]
        public async Task<ActionResult> GetReservationsByParkingSpotId(int parkingSpotId)
        {

            // Check if the parking spot exists
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                return NotFound($"No parking spot found with ID {parkingSpotId}.");
            }

            var reservations = await _reservationRepository.GetReservationsByParkingSpotIdAsync(parkingSpotId);
            var reservationDTOs = reservations.Select(r => new ReservationDTO
            {
                ReservationId = r.ReservationId,
                UserId = r.UserId,
                ParkingSpotId = r.ParkingSpotId,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                Status = r.Status
            }).ToList();

            // If no reservations are found, return a 404 Not Found
            if (reservations == null || !reservations.Any())
            {
                return NotFound("No reservations found for the specified parking spot ID.");
            }

            return Ok(reservationDTOs);
        }

        // POST: api/AddReservation
        [HttpPost("AddReservation")]
        [Authorize]
        public async Task<ActionResult> AddReservation([FromBody] ReservationDTO createReservationDto)
        {
            // Convert DateTime to UTC if necessary to avoid timezone issues when storing in the database
            createReservationDto.StartTime = createReservationDto.StartTime.ToUniversalTime();
            createReservationDto.EndTime = createReservationDto.EndTime.ToUniversalTime();

            // Check if UserId and ParkingSpotId are provided and valid
            if (createReservationDto.UserId <= 0 || createReservationDto.ParkingSpotId <= 0)
            {
                return StatusCode(422, "UserId and ParkingSpotId must be provided!");
            }

            // Check for the existence of the user
            var user = await _userRepository.GetUserByIdAsync(createReservationDto.UserId);
            if (user == null)
            {
                return NotFound($"User with ID {createReservationDto.UserId} not found.");
            }

            // Check for the existence of the parking spot
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(createReservationDto.ParkingSpotId);
            if (parkingSpot == null)
            {
                return NotFound($"Parking spot with ID {createReservationDto.ParkingSpotId} not found!");
            }

            var newReservation = new Reservation
            {
                UserId = createReservationDto.UserId,
                ParkingSpotId = createReservationDto.ParkingSpotId,
                StartTime = createReservationDto.StartTime,
                EndTime = createReservationDto.EndTime,
                Status = createReservationDto.Status
            };

            // Check if the reservation is valid (e.g. start time is before end time) before adding it
            if (newReservation.StartTime >= newReservation.EndTime)
            {
                return StatusCode(422, "Start time must be before end time");
            }

            // Check if the parking spot is available for the given time range before adding the reservation
            bool isSpotAvailable = await _reservationRepository.IsParkingSpotAvailableAsync(newReservation.ParkingSpotId, newReservation.StartTime, newReservation.EndTime);
            if (!isSpotAvailable)
            {
                return Conflict("Parking spot is not available for the given time range.");
            }

            await _reservationRepository.AddReservationAsync(newReservation);
            await _reservationRepository.SaveChangesAsync();

            return Ok(new { message = "Reservation added successfully!" });
        }

        // PUT: api/UpdateReservation
        [HttpPut("UpdateReservation")]
        [Authorize]
        public async Task<IActionResult> UpdateReservation(int reservationId, [FromBody] ReservationDTO updateReservationDto)
        {
            // Convert DateTime to UTC if necessary to avoid timezone issues when storing in the database
            updateReservationDto.StartTime = updateReservationDto.StartTime.ToUniversalTime();
            updateReservationDto.EndTime = updateReservationDto.EndTime.ToUniversalTime();

            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);
            if (reservation == null)
            {
                return NotFound("Reservation not found!");
            }

            // Check if the reservation is valid (e.g. start time is before end time) before updating it
            if (updateReservationDto.StartTime >= updateReservationDto.EndTime)
            {
                return StatusCode(422, "Start time must be before end time");
            }

            // Check if the start time and end time are in the future
            if (updateReservationDto.StartTime < DateTime.UtcNow || updateReservationDto.EndTime < DateTime.UtcNow)
            {
                return StatusCode(422, "Start time and End time must be in the future");
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
                    reservation.ParkingSpotId, updateReservationDto.StartTime, updateReservationDto.EndTime);

                if (!isSpotAvailable)
                {
                    return Conflict("Parking spot is not available for the given time range.");
                }
            }

            // Update the reservation with the new values
            reservation.ParkingSpotId = updateReservationDto.ParkingSpotId;
            reservation.StartTime = updateReservationDto.StartTime;
            reservation.EndTime = updateReservationDto.EndTime;
            reservation.Status = updateReservationDto.Status;

            await _reservationRepository.UpdateReservationAsync(reservation);
            return Ok(new { message = "Reservation updated successfully!", reservation });
        }

        // DELETE: api/DeleteReservation
        [HttpDelete("DeleteReservation")]
        public async Task<IActionResult> DeleteReservation(int reservationId)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId);
            if (reservation == null)
            {
                return NotFound("Reservation not found!");
            }

            // Delete the reservation from the database
            await _reservationRepository.DeleteReservationAsync(reservationId);

            return Ok(new { message = $"Reservation with ID {reservationId} deleted successfully!" });
        }
    }
}
