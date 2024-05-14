using mgms_backend.Entities.Payments;
using mgms_backend.Entities.Reservations;
using mgms_backend.Entities.Users;

namespace mgms_backend.Repositories.Interface
{
    public interface IPaymentRepository
    {
        Task<Payment> AddPaymentAsync(Payment payment); // Add a new payment
        Task<Payment> GetPaymentByIdAsync(int paymentId); // Get payment by ID
        Task<Payment> UpdatePaymentAsync(Payment payment); // Update an existing payment
        Task<IEnumerable<Payment>> GetAllPaymentsAsync(); // Get all payments
        Task<IEnumerable<Payment>> SearchAsync(PaymentSearchCriteria? searchCriteria); // Search for payments
        Task<Reservation?> GetReservationByIdAsync(int reservationId); // Get reservation by ID
        Task<User?> GetUserByIdAsync(int userId); // Get user by ID
        Task DeletePaymentAsync(int paymentId); // Delete a payment
        Task SaveChangesAsync(); // Save changes
    }
}
