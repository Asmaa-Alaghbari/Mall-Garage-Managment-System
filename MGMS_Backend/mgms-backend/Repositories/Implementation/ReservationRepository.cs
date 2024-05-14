using mgms_backend.Data;
using mgms_backend.Entities.Reservations;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories.Implementation
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ApplicationDbContext _context;

        public ReservationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all reservations 
        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
        {
            return await _context.Reservations.ToListAsync();
        }

        // Get reservation by id
        public async Task<Reservation> GetReservationByIdAsync(int reservationId)
        {
            return await _context.Reservations.FindAsync(reservationId);
        }

        // Add a new reservation
        public async Task<Reservation> AddReservationAsync(Reservation reservation)
        {
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        // Get reservation by id
        public async Task<IList<Reservation>> GetReservationsByUserId(int userId)
        {
            return await _context.Reservations.Where(x => x.UserId.Equals(userId)).ToListAsync();
        }

        // Get reservations by parking spot id
        public async Task<List<Reservation>> GetReservationsByParkingSpotIdAsync(int parkingSpotId)
        {
            return await _context.Reservations
                .Where(r => r.ParkingSpotId == parkingSpotId).ToListAsync();
        }

        // Search reservations 
        public async Task<List<Reservation>> SearchAsync(ReservationSearchCriteria? searchCriteria = null)
        {
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Reservations.ToListAsync();
            }

            var query = _context.Reservations.AsQueryable();

            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.ReservationId.ToString().Contains(searchCriteria.Text) ||
                    x.ParkingSpot.Number.ToString().Contains(searchCriteria.Text) ||
                    x.StartTime.ToString().Contains(searchCriteria.Text) ||
                    x.EndTime.ToString().Contains(searchCriteria.Text) ||
                    x.Status.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchCriteria.Status) && searchCriteria.Status != "all")
            {
                query = query.Where(x => x.Status.ToLower().Equals(searchCriteria.Status.ToLower()));
            }


            if (searchCriteria.Date.HasValue)
            {
                query = query.Where(x =>
                    x.StartTime.Day.Equals(searchCriteria.Date.Value.Day) &&
                     x.StartTime.Month.Equals(searchCriteria.Date.Value.Month) &&
                     x.StartTime.Year.Equals(searchCriteria.Date.Value.Year) ||
                    x.EndTime.Day.Equals(searchCriteria.Date.Value.Day) &&
                     x.EndTime.Month.Equals(searchCriteria.Date.Value.Month) &&
                     x.EndTime.Year.Equals(searchCriteria.Date.Value.Year));
            }

            if (searchCriteria.UserId != 0)
            {
                query = query.Where(x => x.UserId.Equals(searchCriteria.UserId));
            }

            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                query = query.OrderByDynamic(searchCriteria.SortByProperty);
            }

            return await query.ToListAsync();
        }

        // Check if a parking spot is available
        public Task<bool> IsParkingSpotAvailableAsync(int parkingSpotId, int reservationId,
            DateTime startTime, DateTime endTime)
        {
            return _context.Reservations
                .Where(r => r.ParkingSpotId == parkingSpotId && r.ReservationId != reservationId)
                .AllAsync(r => (r.EndTime <= startTime || r.StartTime >= endTime));
        }

        // Update a reservation
        public async Task UpdateReservationAsync(Reservation reservation)
        {
            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // Delete a reservation
        public async Task DeleteReservationAsync(int reservationId)
        {
            var reservation = await _context.Reservations.FindAsync(reservationId);
            if (reservation != null)
            {
                _context.Reservations.Remove(reservation);
                await _context.SaveChangesAsync();
            }
        }

        // Save changes 
        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
