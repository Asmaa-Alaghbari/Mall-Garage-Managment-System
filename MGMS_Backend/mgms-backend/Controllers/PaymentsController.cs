using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.PaymentDTO;
using mgms_backend.Helpers;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories.Interface;
using mgms_backend.Exceptions;
using mgms_backend.DTO.PaymentDTO.PaymentDTO;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPaymentMapper _paymentMapper;
        private readonly IUserHelper _userHelper;

        public PaymentsController(
            IPaymentRepository paymentRepository,
            IReservationRepository reservationRepository,
            IUserRepository userRepository,
            IPaymentMapper paymentMapper,
            IUserHelper userHelper)
        {
            _paymentRepository = paymentRepository;
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _paymentMapper = paymentMapper;
            _userHelper = userHelper;
        }

        // GET: api/Payments/GetAllPayments: Get all payments
        [HttpGet("GetAllPayments")]
        [Authorize]
        public async Task<ActionResult> GetAllPayments()
        {
            var payments = await _paymentRepository.GetAllPaymentsAsync();
            return Ok(payments);
        }

        // GET: api/Payments/GetPaymentById: Get payment by ID
        [HttpGet("GetPaymentById")]
        [Authorize]
        public async Task<ActionResult> GetPaymentById(int paymentId)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null)
            {
                throw new EntityNotFoundException("Payment not found!");
            }
            return Ok(payment);
        }

        // POST: api/Payments/AddPayment: Add a new payment
        [HttpPost("AddPayment")]
        [Authorize]
        public async Task<ActionResult> AddPayment([FromBody] PaymentDto createPaymentDto)
        {
            // Check if UserId and ReservationId are provided
            if (createPaymentDto.UserId <= 0 || createPaymentDto.ReservationId <= 0)
            {
                throw new ServerValidationException("UserId and ReservationId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(createPaymentDto.UserId);
            if (userExists == null)
            {
                throw new EntityNotFoundException($"User with ID {createPaymentDto.UserId} not found!");
            }

            // Validate existence of the Reservation
            var reservationExists = await _reservationRepository.GetReservationByIdAsync(createPaymentDto.ReservationId);
            if (reservationExists == null)
            {
                throw new EntityNotFoundException($"Reservation with ID {createPaymentDto.ReservationId} not found!");
            }

            // Check if the payment amount is positive
            if (createPaymentDto.Amount <= 0)
            {
                throw new ServerValidationException("The payment amount must be greater than zero!");
            }

            var newPayment = _paymentMapper.ToModel(createPaymentDto);
            newPayment.DateTime = DateTime.UtcNow;

            // Add the payment to the database
            await _paymentRepository.AddPaymentAsync(newPayment);
            await _paymentRepository.SaveChangesAsync();

            return Ok(new { message = "Payment added successfully!" });
        }

        // POST: api/Payments/SearchPaginated: Search for payments with pagination
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber, [FromQuery] int pageSize,
            [FromBody] PaymentSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _paymentMapper.ToSearchCriteriaModel(searchCriteria);
            searchCriteriaModel.UserId = await _userHelper.GetUserIdForSearchCriteria(User.Identity);

            var fetchedResults = await _paymentRepository.SearchAsync(searchCriteriaModel);
            var totalRecords = fetchedResults.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();

            return Ok(new { TotalPages = totalPages, Data = _paymentMapper.ToCollectionDto(paginatedData) });
        }

        // PUT: api/Payments/UpdatePayment: Update an existing payment
        [HttpPut("UpdatePayment")]
        [Authorize]
        public async Task<IActionResult> UpdatePayment(int paymentId, PaymentDto updatePaymentDto)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null)
            {
                throw new EntityNotFoundException($"Payment with id {paymentId} was not found!");
            }

            // Check if UserId and ReservationId are provided
            if (updatePaymentDto.UserId <= 0 || updatePaymentDto.ReservationId <= 0)
            {
                throw new ServerValidationException("UserId and ReservationId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(updatePaymentDto.UserId);
            if (userExists == null)
            {
                throw new EntityNotFoundException($"User with ID {updatePaymentDto.UserId} not found!");
            }

            // Validate existence of the Reservation
            var reservationExists = await _reservationRepository.GetReservationByIdAsync(updatePaymentDto.ReservationId);
            if (reservationExists == null)
            {
                throw new EntityNotFoundException($"Reservation with ID {updatePaymentDto.ReservationId} not found!");
            }

            // Check if the payment amount is positive
            if (updatePaymentDto.Amount <= 0)
            {
                throw new ServerValidationException("The payment amount must be greater than zero!");
            }

            // Check if UserId is updated
            if (payment.UserId != updatePaymentDto.UserId)
            {
                throw new ServerValidationException($"UserId has been changed from {payment.UserId} to {updatePaymentDto.UserId}");
            }

            // Check if ReservationId is updated
            if (payment.ReservationId != updatePaymentDto.ReservationId)
            {
                throw new ServerValidationException($"ReservationId has been changed from {payment.ReservationId} to {updatePaymentDto.ReservationId}");
            }

            // Update payment properties
            payment.Amount = updatePaymentDto.Amount;
            payment.PaymentMethod = updatePaymentDto.PaymentMethod;
            payment.UserId = updatePaymentDto.UserId;
            payment.ReservationId = updatePaymentDto.ReservationId;

            await _paymentRepository.UpdatePaymentAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            return Ok(new { message = $"Payment with ID {paymentId} updated successfully!" });
        }

        // DELETE: api/Payments/DeletePayment: Delete a payment
        [HttpDelete("DeletePayment")]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            var payment = await _paymentRepository.GetReservationByIdAsync(paymentId);

            if (ReferenceEquals(null, payment))
            {
                throw new EntityNotFoundException("Payment not found!");
            }

            // Delete the Payment from the database
            await _paymentRepository.DeletePaymentAsync(paymentId);
            await _paymentRepository.SaveChangesAsync();

            return Ok(new { message = $"Payment with ID {paymentId} deleted successfully!" });
        }
    }
}
