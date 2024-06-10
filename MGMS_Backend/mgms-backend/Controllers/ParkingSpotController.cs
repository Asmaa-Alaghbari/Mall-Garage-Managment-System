using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using mgms_backend.Entities.ParkingSpots;
using mgms_backend.Repositories.Interface;
using mgms_backend.Mappers.Interface;
using mgms_backend.Exceptions;
using mgms_backend.DTO.ParkingSpotDTO;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ParkingSpotsController : ControllerBase
    {
        private readonly IParkingSpotRepository _parkingSpotRepository;
        private readonly IParkingSpotMapper _parkingSpotMapper;

        public ParkingSpotsController(IParkingSpotRepository parkingSpotRepository, IParkingSpotMapper parkingSpotMapper)
        {
            _parkingSpotRepository = parkingSpotRepository;
            _parkingSpotMapper = parkingSpotMapper;
        }

        // GET: api/GetAllParkingSpots: Get all parking spots
        [HttpGet("GetAllParkingSpots")]
        [Authorize]
        public async Task<ActionResult> GetAllParkingSpots()
        {
            var spots = await _parkingSpotRepository.GetAllParkingSpotsAsync();
            return Ok(spots);
        }

        // GET: api/GetParkingSpotById: Get a parking spot by ID
        [HttpGet("GetParkingSpotById")]
        [Authorize]
        public async Task<ActionResult> GetParkingSpotById(int parkingSpotId)
        {
            var spot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);

            // Check if the spot is not found
            if (spot == null)
            {
                throw new EntityNotFoundException("Spot not found!");
            }

            return Ok(spot);
        }

        // GET: api/GetParkingSpotsPagination: Get parking spots with pagination
        [HttpGet("GetParkingSpotsPagination")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ParkingSpot>>> GetParkingSpotsPagination(
            int pageNumber = 1, int pageSize = 10)
        {
            var spots = await _parkingSpotRepository.GetParkingSpotsAsync(pageNumber, pageSize);
            return Ok(spots);
        }

        // Get: api/GetParkingSpotSummary: Get the summary of parking spots
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

        // POST: api/AddParkingSpot: Add a new parking spot
        [HttpPost("AddParkingSpot")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateParkingSpot([FromBody] ParkingSpotDto parkingSpotDto)
        {
            var newParkingSpot = _parkingSpotMapper.ToModel(parkingSpotDto);

            // Check if another spot has the same number and is not the current spot
            var existingSpot = await _parkingSpotRepository.GetParkingSpotByNumberAsync(parkingSpotDto.ParkingSpotNumber);
            if (existingSpot != null && existingSpot.ParkingSpotId != newParkingSpot.ParkingSpotId)
            {
                throw new ServerValidationException($"Another spot with number {parkingSpotDto.ParkingSpotNumber} already exists.");
            }

            var addedParkingSpot = await _parkingSpotRepository.AddParkingSpotAsync(newParkingSpot);
            var createdParkingSpot = CreatedAtAction(nameof(GetParkingSpotById),
                new { parkingSpotId = addedParkingSpot.ParkingSpotId }, addedParkingSpot);
            return Ok(new { message = "Spot added successfully!", createdParkingSpot });
        }

        // POST: api/SearchPaginated: 
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromBody] ParkingSpotSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _parkingSpotMapper.ToSearchCriteriaModel(searchCriteria);
            var fetchedResults = await _parkingSpotRepository.SearchAsync(searchCriteriaModel);

            var totalRecords = fetchedResults.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { TotalPages = totalPages, Data = _parkingSpotMapper.ToCollectionDto(paginatedData) });
        }

        // PUT: api/UpdateParkingSpot
        [HttpPut("UpdateParkingSpot")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateParkingSpot(int parkingSpotId, [FromBody] ParkingSpotDto parkingSpotDto)
        {
            var parkingSpotToUpdate = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpotToUpdate == null)
            {
                throw new EntityNotFoundException("Spot not found!");
            }

            // Check if another spot has the same number and is not the current spot
            var existingSpot = await _parkingSpotRepository.GetParkingSpotByNumberAsync(parkingSpotDto.ParkingSpotNumber);
            if (existingSpot != null && existingSpot.ParkingSpotId != parkingSpotId)
            {
                throw new ServerValidationException($"Another spot with number {parkingSpotDto.ParkingSpotNumber} already exists.");
            }

            // Update the parking spot with the new values
            parkingSpotToUpdate.ParkingSpotNumber = parkingSpotDto.ParkingSpotNumber;
            parkingSpotToUpdate.Section = parkingSpotDto.Section;
            parkingSpotToUpdate.IsOccupied = parkingSpotDto.IsOccupied;
            parkingSpotToUpdate.Size = parkingSpotDto.Size;

            // Update the parking spot in the database and return the updated spot
            await _parkingSpotRepository.UpdateParkingSpotAsync(parkingSpotToUpdate);

            return Ok(new { message = "Spot updated successfully!", parkingSpotToUpdate });
        }

        // PUT: api/ReserveParkingSpot: Reserve a parking spot
        [HttpPut("ReserveParkingSpot")]
        [Authorize]
        public async Task<IActionResult> ReserveParkingSpot(int parkingSpotId)
        {
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                throw new EntityNotFoundException("Spot not found!");
            }

            // Check if the spot is already occupied
            if (parkingSpot.IsOccupied)
            {
                throw new ServerValidationException("Spot is already occupied!");
            }

            // Update the spot to be occupied
            parkingSpot.IsOccupied = true;
            await _parkingSpotRepository.UpdateParkingSpotAsync(parkingSpot);

            return Ok(new { message = "Spot reserved successfully!", parkingSpot });
        }

        // DELETE: api/DeleteParkingSpot: Delete a parking spot
        [HttpDelete("DeleteParkingSpot")]
        [Authorize(Roles = "ADMIN")] // Only admin users can delete parking spots
        public async Task<IActionResult> DeleteParkingSpot(int parkingSpotId)
        {
            var parkingSpot = await _parkingSpotRepository.GetParkingSpotByIdAsync(parkingSpotId);
            if (parkingSpot == null)
            {
                throw new EntityNotFoundException("Spot not found!");
            }

            // Delete the parking spot from the database
            await _parkingSpotRepository.DeleteParkingSpotAsync(parkingSpotId);

            return Ok(new { message = $"Spot with ID {parkingSpotId} deleted successfully!" });
        }
    }
}
