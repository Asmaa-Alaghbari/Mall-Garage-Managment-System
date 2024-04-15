using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync(); // Get all payments
        Task<Payment> GetPaymentByIdAsync(int paymentId); // Get payment by ID
        Task<Payment> AddPaymentAsync(Payment payment); // Add a new payment
        Task<Payment> UpdatePaymentAsync(Payment payment); // Update an existing payment
        Task DeletePaymentAsync(int paymentId); // Delete a payment
        Task<ValueTask<Reservation?>> GetReservationByIdAsync(int reservationId); // Get reservation by ID
        Task<ValueTask<User?>> GetUserByIdAsync(int userId); // Get user by ID
        Task SaveChangesAsync(); // Save changes
    }
}
