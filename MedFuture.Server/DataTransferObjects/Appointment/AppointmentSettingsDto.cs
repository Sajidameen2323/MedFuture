using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Appointment
{
    public class AppointmentSettingsDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Minimum time before booking must be a non-negative value and greater than 1.")]
        public int MinimumTimeBeforeBookingInDays { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Minimum time before canceling must be a non-negative value and greater than 1.")]
        public int MinimumTimeBeforeCancelingInDays { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Minimum time before rescheduling must be a non-negative value and greater than 1.")]
        public int MinimumTimeBeforeReschedulingInDays { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Booking period must be a non-negative value and greater than 1.")]
        public int BookingPeriodInDays { get; set; }
    }
}
