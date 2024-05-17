using MedFuture.Server.DataTransferObjects.Payment;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IPaymentRepository
    {
        Task<PaymentM> AddPayment(AddPaymentDto paymentDto);
    }
}
