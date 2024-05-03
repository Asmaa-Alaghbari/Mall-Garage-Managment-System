using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
{
    public class ParkingSpotRepository : IParkingSpotRepository
    {
        private readonly ApplicationDbContext _context;
        public ParkingSpotRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add a new parking spot to the database
        public async Task<ParkingSpot> AddParkingSpotAsync(ParkingSpot parkingSpot)
        {
            _context.ParkingSpots.Add(parkingSpot);
            await _context.SaveChangesAsync();
            return parkingSpot;
        }

        // Delete a parking spot from the database
        public async Task DeleteParkingSpotAsync(int parkingSpotId)
        {
            var parkingSpot = await _context.ParkingSpots.FindAsync(parkingSpotId);
            if (parkingSpot != null)
            {
                _context.ParkingSpots.Remove(parkingSpot);
                await _context.SaveChangesAsync();
            }
        }

        // Get all parking spots from the database
        public async Task<IEnumerable<ParkingSpot>> GetAllParkingSpotsAsync()
        {
            return await _context.ParkingSpots.ToListAsync();
        }

        // Get the count of available parking spots
        public async Task<int> GetAvailableParkingSpotsAsync()
        {
            return await _context.ParkingSpots.CountAsync(spot => !spot.IsOccupied);

        }

        // Get the count of occupied parking spots
        public async Task<int> GetOccupiedParkingSpotsAsync()
        {
            return await _context.ParkingSpots.CountAsync(spot => spot.IsOccupied);
        }

        // Get a parking spot by id from the database
        public async Task<ParkingSpot> GetParkingSpotByIdAsync(int parkingSpotId)
        {
            return await _context.ParkingSpots.FindAsync(parkingSpotId);
        }

        // Get a parking spot by number from the database
        public async Task<ParkingSpot> GetParkingSpotByNumberAsync(string number)
        {
            return await _context.ParkingSpots.FirstOrDefaultAsync(ps => ps.Number == number);

        }

        // Get parking spots paginated
        public async Task<IEnumerable<ParkingSpot>> GetParkingSpotsAsync(int pageNumber, int pageSize)
        {
            return await _context.ParkingSpots.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        // Save changes to the database
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // Update an existing parking spot in the database
        public async Task UpdateParkingSpotAsync(ParkingSpot parkingSpot)
        {
            _context.Entry(parkingSpot).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
