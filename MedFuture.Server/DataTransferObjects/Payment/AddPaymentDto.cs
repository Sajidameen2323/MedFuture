using MedFuture.Server.Models;

namespace MedFuture.Server.DataTransferObjects.Payment
{
    public class AddPaymentDto
    {
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMode PaymentMode { get; set; }
        public decimal AdditionalCost { get; set; } = decimal.Zero;
    }
}
