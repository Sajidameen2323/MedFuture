using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Payment;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class PaymentRepository: IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentM> AddPayment(AddPaymentDto paymentDto)
        {

            var app = _context.Appointments.Where(a=> a.AppointmentId == paymentDto.AppointmentId)
                .Include(a=> a.Payment)
                .FirstOrDefault();   

            if (app == null)
            {
                throw new ArgumentException("Invalid Appointment Id");
            }

            decimal taxAmount = (0/100) * paymentDto.Amount;
            PaymentM paymentM;
            if (app.PaymentId.HasValue)
            {
                paymentM = app.Payment;
                paymentM.PaymentDate = DateTime.Now;
                paymentM.PaymentMode = paymentDto.PaymentMode;
                paymentM.Amount = paymentDto.Amount + taxAmount;
                paymentM.TaxAmount = taxAmount;
            }
            else
            {
                paymentM = new PaymentM()
                {
                    AppointmentId = app.AppointmentId,
                    PaymentDate = DateTime.Now,
                    PaymentMode = paymentDto.PaymentMode,
                    Amount = paymentDto.Amount + taxAmount,
                    TaxAmount = taxAmount,
                };

                app.Payment = paymentM;
            }

            await _context.SaveChangesAsync();

            return paymentM;

        }
    }
}
