using mgms_backend.DTO.PaymentDTO.PaymentDTO;
using mgms_backend.DTO.PaymentDTO;
using mgms_backend.Entities.Payments;

namespace mgms_backend.Mappers.Interface
{
    // Mapper interface for Payment entity
    public interface IPaymentMapper
    {
        public Payment? ToModel(PaymentDto? dto); // Convert PaymentDto to Payment
        public PaymentDto? ToDto(Payment? model); // Convert Payment to PaymentDto
        public PaymentSearchCriteria? ToSearchCriteriaModel(PaymentSearchCriteriaDto? dto); // Convert PaymentSearchCriteriaDto to PaymentSearchCriteria
        public IList<PaymentDto>? ToCollectionDto(IList<Payment>? model); // Convert list of Payment to list of PaymentDto
        public IList<Payment>? ToCollectionModel(IList<PaymentDto>? dto); // Convert list of PaymentDto to list of Payment
    }
}
