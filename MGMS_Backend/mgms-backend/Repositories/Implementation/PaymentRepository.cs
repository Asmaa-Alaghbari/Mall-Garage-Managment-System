using mgms_backend.Data;
using mgms_backend.Entities.Payments;
using mgms_backend.Entities.Reservations;
using mgms_backend.Entities.Users;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories.Implementation
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

        // Search payments based on search criteria
        public async Task<IEnumerable<Payment>> SearchAsync(PaymentSearchCriteria? searchCriteria)
        {
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Payments.ToListAsync();
            }

            var query = _context.Payments.AsQueryable();

            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.PaymentId.ToString().Contains(searchCriteria.Text) ||
                    x.ReservationId.ToString().Contains(searchCriteria.Text) ||
                    x.Amount.ToString().Contains(searchCriteria.Text) ||
                    x.DateTime.ToString().Contains(searchCriteria.Text) ||
                    x.PaymentMethod.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchCriteria.Method))
            {
                query = query.Where(x => x.PaymentMethod.Equals(searchCriteria.Method));
            }

            if (searchCriteria.Date.HasValue)
            {
                query = query.Where(x =>
                    x.DateTime.Day.Equals(searchCriteria.Date.Value.Day) &&
                    x.DateTime.Month.Equals(searchCriteria.Date.Value.Month) &&
                    x.DateTime.Year.Equals(searchCriteria.Date.Value.Year));
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

        // Get reservation by ID
        public async Task<Reservation?> GetReservationByIdAsync(int reservationId)
        {
            return await _context.Reservations.FindAsync(reservationId);
        }

        // Get user by ID
        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        // Save changes
        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
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
    }
}
