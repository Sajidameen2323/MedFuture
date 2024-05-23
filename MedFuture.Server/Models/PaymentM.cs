using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.Models
{
    public class PaymentM
    {
        [Key]
        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public AppointmentM Appointment { get; set; } // Navigation property for Appointment
        public decimal Amount { get; set; }
        public PaymentMode PaymentMode { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal AdditionalCost { get; set; } = decimal.Zero;

        public decimal TotalCost { get; set; }

    }

    public enum PaymentMode
    {
        Cash = 1,
        Card = 2
    }
}
