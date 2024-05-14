using mgms_backend.Data;
using mgms_backend.Entities.ParkingSpots;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories.Implementation
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

        // Get a parking spot by id from the database
        public async Task<ParkingSpot> GetParkingSpotByIdAsync(int parkingSpotId)
        {
            return await _context.ParkingSpots.FindAsync(parkingSpotId);
        }

        // Get a parking spot by number from the database
        public async Task<ParkingSpot> GetParkingSpotByNumberAsync(int number)
        {
            return await _context.ParkingSpots.FirstOrDefaultAsync(ps => ps.Number == number);

        }

        // Get all parking spots from the database
        public async Task<IEnumerable<ParkingSpot>> GetAllParkingSpotsAsync()
        {
            return await _context.ParkingSpots.ToListAsync();
        }

        // Search for parking spots based on search criteria
        public async Task<IEnumerable<ParkingSpot>> SearchAsync(ParkingSpotSearchCriteria? searchCriteria)
        {
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.ParkingSpots.ToListAsync();
            }

            IQueryable<ParkingSpot> query = _context.ParkingSpots;

            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.ParkingSpotId.ToString().Contains(searchCriteria.Text) ||
                    x.Number.ToString().Contains(searchCriteria.Text) ||
                    x.Section.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.Size.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchCriteria.Section) && searchCriteria.Section != "all")
            {
                query = query.Where(x => x.Section.Equals(searchCriteria.Section));
            }

            if (!string.IsNullOrEmpty(searchCriteria.Size) && searchCriteria.Size != "all")
            {
                query = query.Where(x => x.Size.ToLower().Equals(searchCriteria.Size.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchCriteria.Status) && searchCriteria.Status != "all")
            {
                if (searchCriteria.Status.Equals("occupied", StringComparison.InvariantCultureIgnoreCase))
                {
                    query = query.Where(x => x.IsOccupied);
                }

                if (searchCriteria.Status.Equals("available", StringComparison.InvariantCultureIgnoreCase))
                {
                    query = query.Where(x => !x.IsOccupied);
                }
            }

            // Sort the parking spots based on the sort by property
            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                if (searchCriteria.SortByProperty.ToLower().Contains("size"))
                {
                    var sizeOrder = new Dictionary<string, int>
                    {
                        { "Small", 1 },
                        { "Medium", 2 },
                        { "Large", 3 }
                    };

                    var parkingSpots = await query.ToListAsync();
                    parkingSpots = parkingSpots.OrderBy(x => sizeOrder[x.Size]).ToList();
                    return parkingSpots;
                }
                else
                {
                    query = query.OrderByDynamic(searchCriteria.SortByProperty);
                }
            }

            return await query.ToListAsync();
        }

        // Get parking spots paginated
        public async Task<IEnumerable<ParkingSpot>> GetParkingSpotsAsync(int pageNumber, int pageSize)
        {
            return await _context.ParkingSpots.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
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
    }
}
