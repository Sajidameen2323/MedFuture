using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedFuture.Server.Models
{
    public class AppointmentSettingsM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Minimum time before booking must be a non-negative value.")]
        public int MinimumTimeBeforeBookingInDays { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Minimum time before canceling must be a non-negative value.")]
        public int MinimumTimeBeforeCancelingInDays { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Minimum time before rescheduling must be a non-negative value.")]
        public int MinimumTimeBeforeReschedulingInDays { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Booking period must be a non-negative value.")]
        public int BookingPeriodInDays { get; set; }

        [Range(0, 100, ErrorMessage = "Appointment Tax Percentage must be a non-negative value between 0 and 100.")]
        public Decimal AppointmentTaxPercentage { get; set; } = 0;
    }
}
