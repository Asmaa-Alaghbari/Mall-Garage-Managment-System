using mgms_backend.Models;
using mgms_backend.DTO;
using mgms_backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace mgms_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IReservationRepository _reservationRepository;

        public PaymentsController(IPaymentRepository paymentRepository, IUserRepository userRepository, IReservationRepository reservationRepository)
        {
            _paymentRepository = paymentRepository;
            _userRepository = userRepository;
            _reservationRepository = reservationRepository;
        }

        [HttpGet("GetAllPayments")]
        [Authorize]
        public async Task<ActionResult> GetAllPayments()
        {
            var payments = await _paymentRepository.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("GetPaymentById")]
        [Authorize]
        public async Task<ActionResult> GetPaymentById(int paymentId)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null)
            {
                return NotFound("Payment not found!");
            }
            return Ok(payment);
        }

        [HttpPost("AddPayment")]
        [Authorize]
        public async Task<ActionResult> AddPayment([FromBody] PaymentDTO createPaymentDto)
        {
            // Check if UserId and ReservationId are provided
            if (createPaymentDto.UserId <= 0 || createPaymentDto.ReservationId <= 0)
            {
                return BadRequest("UserId and ReservationId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(createPaymentDto.UserId);
            if (userExists == null)
            {
                return NotFound($"User with ID {createPaymentDto.UserId} not found!");
            }

            // Validate existence of the Reservation
            var reservationExists = await _reservationRepository.GetReservationByIdAsync(createPaymentDto.ReservationId);
            if (reservationExists == null)
            {
                return NotFound($"Reservation with ID {createPaymentDto.ReservationId} not found!");
            }

            // Check if the payment amount is positive
            if (createPaymentDto.Amount <= 0)
            {
                return StatusCode(422, "The payment amount must be greater than zero!");
            }

            var newPayment = new Payment
            {
                UserId = createPaymentDto.UserId,
                ReservationId = createPaymentDto.ReservationId,
                Amount = createPaymentDto.Amount,
                PaymentMethod = createPaymentDto.PaymentMethod,
                DateTime = DateTime.UtcNow,
            };

            // Add the payment to the database
            await _paymentRepository.AddPaymentAsync(newPayment);
            await _paymentRepository.SaveChangesAsync();

            return Ok(new { message = "Payment added successfully!" });
        }

        [HttpPut("UpdatePayment")]
        [Authorize]
        public async Task<IActionResult> UpdatePayment(int paymentId, PaymentDTO updatePaymentDto)
        {
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
            if (payment == null)
            {
                return NotFound();
            }

            // Check if UserId and ReservationId are provided
            if (updatePaymentDto.UserId <= 0 || updatePaymentDto.ReservationId <= 0)
            {
                return BadRequest("UserId and ReservationId must be provided!");
            }

            // Validate existence of the User
            var userExists = await _userRepository.GetUserByIdAsync(updatePaymentDto.UserId);
            if (userExists == null)
            {
                return NotFound($"User with ID {updatePaymentDto.UserId} not found!");
            }

            // Validate existence of the Reservation
            var reservationExists = await _reservationRepository.GetReservationByIdAsync(updatePaymentDto.ReservationId);
            if (reservationExists == null)
            {
                return NotFound($"Reservation with ID {updatePaymentDto.ReservationId} not found!");
            }

            // Check if the payment amount is positive
            if (updatePaymentDto.Amount <= 0)
            {
                return StatusCode(422, "The payment amount must be greater than zero!");
            }

            // Check if UserId is updated
            if (payment.UserId != updatePaymentDto.UserId)
            {
                return Conflict($"UserId has been changed from {payment.UserId} to {updatePaymentDto.UserId}");
            }

            // Check if ReservationId is updated
            if (payment.ReservationId != updatePaymentDto.ReservationId)
            {
                return StatusCode(409, $"ReservationId has been changed from {payment.ReservationId} to {updatePaymentDto.ReservationId}");
            }

            // Update payment properties
            payment.Amount = updatePaymentDto.Amount;
            payment.PaymentMethod = updatePaymentDto.PaymentMethod;
            payment.UserId = updatePaymentDto.UserId;
            payment.ReservationId = updatePaymentDto.ReservationId;

            try
            {
                await _paymentRepository.UpdatePaymentAsync(payment);
                await _paymentRepository.SaveChangesAsync();

                return Ok(new { message = "Payment with ID { paymentId} updated successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to update payment with ID {paymentId}. Error: {ex.Message}");
                return StatusCode(500, "An error occurred while updating the payment.");
            }
        }

        [HttpDelete("DeletePayment")]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            var payment = await _paymentRepository.GetReservationByIdAsync(paymentId);
            if (payment == null)
            {
                return NotFound("Payment not found!");
            }

            // Delete the Payment from the database
            await _paymentRepository.DeletePaymentAsync(paymentId);
            await _paymentRepository.SaveChangesAsync();

            return Ok(new { message = $"Payment with ID {paymentId} deleted successfully!" });
        }
    }
}
