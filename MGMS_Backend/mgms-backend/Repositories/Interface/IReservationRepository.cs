using mgms_backend.Entities.Reservations;

namespace mgms_backend.Repositories.Interface
{
    public interface IReservationRepository
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(); // Get all reservations 
        Task<Reservation> AddReservationAsync(Reservation reservation); // Add a new reservation
        Task<Reservation> GetReservationByIdAsync(int reservationId); // Get reservation by id
        Task<List<Reservation>> GetReservationsByParkingSpotIdAsync(int parkingSpotId); // Get reservations by parking spot id
        Task<IList<Reservation>> GetReservationsByUserId(int userId); // Get reservations by user id
        Task<List<Reservation>> SearchAsync(ReservationSearchCriteria? searchCriteria = null); // Save changes 
        Task<bool> IsParkingSpotAvailableAsync(int parkingSpotId, int reservationId, DateTime startTime,
                    DateTime endTime); // Check if a parking spot is available
        Task UpdateReservationAsync(Reservation reservation); // Update a reservation
        Task DeleteReservationAsync(int reservationId); // Delete a reservation
        Task SaveChangesAsync(); // Save changes
    }
}
