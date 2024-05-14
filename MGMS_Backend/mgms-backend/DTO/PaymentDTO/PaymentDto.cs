using System.ComponentModel.DataAnnotations;

namespace mgms_backend.DTO.PaymentDTO
{
    // Represents a payment data transfer object
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero!")]
        public decimal Amount { get; set; }
        [MaxLength(50)]
        [Required]
        public string PaymentMethod { get; set; }
        public DateTime DateTime { get; set; }
    }
}
