using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    public interface IReservationRepository
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(); // Get all reservations 
        Task<Reservation> GetReservationByIdAsync(int reservationId); // Get reservation by id
        Task<Reservation> AddReservationAsync(Reservation reservation); // Add a new reservation
        Task UpdateReservationAsync(Reservation reservation); // Update a reservation
        Task DeleteReservationAsync(int reservationId); // Delete a reservation
        Task<bool> IsParkingSpotAvailableAsync(int parkingSpotId, DateTime startTime, DateTime endTime); // Check if a parking spot is available
        Task SaveChangesAsync(); // Save changes
    }
}
