using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    public interface IParkingSpotRepository
    {
        Task<IEnumerable<ParkingSpot>> GetAllParkingSpotsAsync(); // Get all parking spots from the database
        Task<ParkingSpot> GetParkingSpotByIdAsync(int id); // Get a parking spot by id from the database
        Task<ParkingSpot> AddParkingSpotAsync(ParkingSpot parkingSpot); // Add a new parking spot to the database
        Task UpdateParkingSpotAsync(ParkingSpot parkingSpot); // Update an existing parking spot in the database
        Task DeleteParkingSpotAsync(int id); // Delete a parking spot from the database
        Task SaveChangesAsync(); // Save changes to the database
        Task<ParkingSpot> GetParkingSpotByNumberAsync(string number); // Get a parking spot by number from the database
        Task<int> GetAvailableParkingSpotsAsync(); // Get the count of available parking spots
        Task<int> GetOccupiedParkingSpotsAsync();  // Get the count of occupied parking spots
        Task<IEnumerable<ParkingSpot>> GetParkingSpotsAsync(int pageNumber, int pageSize); // Get parking spots with pagination
    }
}
