using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Appointment
{
    public class AppRescheduleDto
    {
        [Required]
        public DateTime StartDateTime { get; set; }  // New property for appointment start
    }
}
