using mgms_backend.DTO;
using mgms_backend.Models;
using mgms_backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;

        public ReservationsController(IReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
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

        // POST: api/CreateReservation
        [HttpPost("CreateReservation")]
        [Authorize]
        public async Task<ActionResult> CreateReservation([FromBody] ReservationDTO createReservationDto)
        {
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
            var isParkingSpotAvailable = await _reservationRepository.IsParkingSpotAvailableAsync(
                newReservation.ParkingSpotId, newReservation.StartTime, newReservation.EndTime);
            if (!isParkingSpotAvailable)
            {
                return StatusCode(409, "Parking spot is not available for the given time range");
            }

            // Check if the user has another reservation that overlaps with the new reservation
            var userReservations = await _reservationRepository.GetAllReservationsAsync();
            var overlappingReservation = userReservations.FirstOrDefault(r =>
                r.UserId == newReservation.UserId &&
                r.ParkingSpotId == newReservation.ParkingSpotId &&
                r.EndTime > newReservation.StartTime &&
                r.StartTime < newReservation.EndTime);

            // If there is an overlapping reservation, return a 409 Conflict status code
            if (overlappingReservation != null)
            {
                return StatusCode(409,
                    "User already has a reservation for this parking spot that overlaps with the new reservation");
            }

            try
            {
                await _reservationRepository.AddReservationAsync(newReservation);
                return CreatedAtAction(nameof(GetReservationById), 
                    new { id = newReservation.ReservationId }, newReservation);
            }
            catch (DbUpdateException ex)
            {
                // Log the exception, handle or rethrow
                return StatusCode(500, "An error occurred while saving the reservation. Please try again!");
            }
        }

        // PUT: api/UpdateReservation
        [HttpPut("UpdateReservation")]
        [Authorize]
        public async Task<IActionResult> UpdateReservation(int reservationId, [FromBody] UpdateReservationDTO updateReservationDto)
        {
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

            // Check if the parking spot is available for the given time range before updating the reservation
            // if the parking spot is different from the original reservation
            if (updateReservationDto.ParkingSpotId != reservation.ParkingSpotId)
            {
                var isParkingSpotAvailable = await _reservationRepository.IsParkingSpotAvailableAsync(
                                       updateReservationDto.ParkingSpotId, updateReservationDto.StartTime, updateReservationDto.EndTime);
                if (!isParkingSpotAvailable)
                {
                    return StatusCode(409, "Parking spot is not available for the given time range");
                }
            }

            // Update the reservation with the new values
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
