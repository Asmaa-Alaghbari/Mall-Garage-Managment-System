using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
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

        // Check if a parking spot is available
        public Task<bool> IsParkingSpotAvailableAsync(int parkingSpotId, DateTime startTime, DateTime endTime)
        {
            return _context.Reservations
                .Where(r => r.ParkingSpotId == parkingSpotId)
                .AllAsync(r => r.EndTime <= startTime || r.StartTime >= endTime);
        }
    }
}
