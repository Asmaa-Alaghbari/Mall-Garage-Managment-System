using Microsoft.AspNetCore.Mvc;
using mgms_backend.Repositories;
using mgms_backend.Models;
using mgms_backend.DTO;
using Microsoft.AspNetCore.Authorization;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ParkingSpotsController : ControllerBase
    {
        private readonly IParkingSpotRepository _parkingSpotRepository;

        public ParkingSpotsController(IParkingSpotRepository parkingSpotRepository)
        {
            _parkingSpotRepository = parkingSpotRepository;
        }

        // GET: api/GetAllParkingSpots
        [HttpGet("GetAllParkingSpots")]
        [Authorize]
        public async Task<ActionResult> GetAllParkingSpots()
        {
            var spots = await _parkingSpotRepository.GetAllParkingSpotsAsync();
            return Ok(spots);
        }

        // GET: api/GetParkingSpotsPagination
        [HttpGet("GetParkingSpotsPagination")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ParkingSpot>>> GetParkingSpotsPagination(
            int pageNumber = 1, int pageSize = 10)
        {
            var spots = await _parkingSpotRepository.GetParkingSpotsAsync(pageNumber, pageSize);
            return Ok(spots);
        }

        // GET: api/GetParkingSpotById
        [HttpGet("GetParkingSpotById")]
        [Authorize]
        public async Task<ActionResult> GetParkingSpotById(int parkingSpotId)
        {
            var spot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);

            // If the spot is not found, return a 404 Not Found
            if (spot == null)
            {
                return NotFound("Spot not found!");
            }

            return Ok(spot);
        }

        // Get: api/GetParkingSpotSummary
        [HttpGet("GetParkingSpotSummary")]
        [Authorize]
        public async Task<IActionResult> GetParkingSpotsSummary()
        {
            // Get the count of available and occupied parking spots 
            var availableSpotsCount = await _parkingSpotRepository.GetAvailableParkingSpotsAsync();
            var occupiedSpotsCount = await _parkingSpotRepository.GetOccupiedParkingSpotsAsync();

            // Total spots is the sum of available and occupied
            var totalSpotsCount = availableSpotsCount + occupiedSpotsCount;

            // Construct a summary object to return
            var summary = new
            {
                available = availableSpotsCount,
                occupied = occupiedSpotsCount,
                total = totalSpotsCount
            };

            return Ok(summary); // The total spots count is the sum of available and occupied spots
        }

        // POST: api/AddParkingSpot
        [HttpPost("AddParkingSpot")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateParkingSpot([FromBody] ParkingSpotDTO parkingSpotDto)
        {
            var newParkingSpot = new ParkingSpot
            {
                Number = parkingSpotDto.Number,
                Section = parkingSpotDto.Section,
                Size = parkingSpotDto.Size,
                IsOccupied = parkingSpotDto.IsOccupied
            };

            // Check if another spot has the same number and is not the current spot
            var existingSpot = await _parkingSpotRepository.GetParkingSpotByNumberAsync(parkingSpotDto.Number);
            if (existingSpot != null && existingSpot.ParkingSpotId != newParkingSpot.ParkingSpotId)
            {
                return Conflict(new { message = $"Another spot with number {parkingSpotDto.Number} already exists." });
            }

            var addedParkingSpot = await _parkingSpotRepository.AddParkingSpotAsync(newParkingSpot);
            var createdParkingSpot = CreatedAtAction(nameof(GetParkingSpotById),
                new { parkingSpotId = addedParkingSpot.ParkingSpotId }, addedParkingSpot);
            return Ok(new { message = "Spot added successfully!", createdParkingSpot });
        }

        // PUT: api/UpdateParkingSpot
        [HttpPut("UpdateParkingSpot")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateParkingSpot(int parkingSpotId, [FromBody] ParkingSpotDTO parkingSpotDto)
        {
            var parkingSpotToUpdate = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpotToUpdate == null)
            {
                return NotFound("Spot not found!");
            }

            // Check if another spot has the same number and is not the current spot
            var existingSpot = await _parkingSpotRepository.GetParkingSpotByNumberAsync(parkingSpotDto.Number);
            if (existingSpot != null && existingSpot.ParkingSpotId != parkingSpotId)
            {
                return Conflict(new { message = $"Another spot with number {parkingSpotDto.Number} already exists." });
            }

            // Update the parking spot with the new values
            parkingSpotToUpdate.Number = parkingSpotDto.Number;
            parkingSpotToUpdate.Section = parkingSpotDto.Section;
            parkingSpotToUpdate.IsOccupied = parkingSpotDto.IsOccupied;
            parkingSpotToUpdate.Size = parkingSpotDto.Size;

            // Update the parking spot in the database and return the updated spot
            await _parkingSpotRepository.UpdateParkingSpotAsync(parkingSpotToUpdate);

            return Ok(new { message = "Spot updated successfully!", parkingSpotToUpdate });
        }

        // PUT: api/ReserveParkingSpot
        [HttpPut("ReserveParkingSpot")]
        [Authorize]
        public async Task<IActionResult> ReserveParkingSpot(int parkingSpotId)
        {
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                return NotFound("Spot not found!");
            }

            // Check if the spot is already occupied
            if (parkingSpot.IsOccupied)
            {
                return Conflict(new { message = "Spot is already occupied!" });
            }

            // Update the spot to be occupied
            parkingSpot.IsOccupied = true;
            await _parkingSpotRepository.UpdateParkingSpotAsync(parkingSpot);

            return Ok(new { message = "Spot reserved successfully!", parkingSpot });
        }

        // DELETE: api/DeleteParkingSpot
        [HttpDelete("DeleteParkingSpot")]
        [Authorize(Roles = "ADMIN")] // Only admin users can delete parking spots
        public async Task<IActionResult> DeleteParkingSpot(int parkingSpotId)
        {
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                return NotFound("Spot not found!");
            }

            // Delete the parking spot from the database
            await _parkingSpotRepository.DeleteParkingSpotAsync(parkingSpotId);

            return Ok(new { message = $"Spot with ID {parkingSpotId} deleted successfully!" });
        }
    }
}
