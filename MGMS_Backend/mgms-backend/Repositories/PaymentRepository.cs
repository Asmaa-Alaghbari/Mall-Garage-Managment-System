using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all payments
        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        // Get payment by ID
        public async Task<Payment> GetPaymentByIdAsync(int paymentId)
        {
            return await _context.Payments.FindAsync(paymentId);
        }

        // Add a new payment
        public async Task<Payment> AddPaymentAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        // Update an existing payment
        public async Task<Payment> UpdatePaymentAsync(Payment payment)
        {
            _context.Entry(payment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return payment;
        }

        // Delete a payment
        public async Task DeletePaymentAsync(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment != null)
            {
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
            }
        }

        // Get reservation by ID
        public async Task<ValueTask<Reservation?>> GetReservationByIdAsync(int reservationId)
        {
            return _context.Reservations.FindAsync(reservationId);
        }

        // Get user by ID
        public async Task<ValueTask<User?>> GetUserByIdAsync(int userId)
        {
            return _context.Users.FindAsync(userId);
        }

        // Save changes
        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
