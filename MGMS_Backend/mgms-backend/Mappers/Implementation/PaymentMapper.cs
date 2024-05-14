using mgms_backend.DTO.PaymentDTO;
using mgms_backend.DTO.PaymentDTO.PaymentDTO;
using mgms_backend.Entities.Payments;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps Payment entities to Payment DTOs and vice versa
    [Mapper] 
    public partial class PaymentMapper : IPaymentMapper
    {
        public partial Payment? ToModel(PaymentDto? dto); // Convert PaymentDto to Payment
        public partial PaymentDto? ToDto(Payment? model); // Convert Payment to PaymentDto
        public partial PaymentSearchCriteria? ToSearchCriteriaModel(PaymentSearchCriteriaDto? dto); // Convert PaymentSearchCriteriaDto to PaymentSearchCriteria
        public partial IList<PaymentDto>? ToCollectionDto(IList<Payment>? model); // Convert IList<Payment> to IList<PaymentDto>
        public partial IList<Payment>? ToCollectionModel(IList<PaymentDto>? dto); // Convert IList<PaymentDto> to IList<Payment>
    }
}
