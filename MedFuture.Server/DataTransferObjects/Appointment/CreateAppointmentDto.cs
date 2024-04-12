using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Appointment
{
    public class CreateAppointmentDto
    {
        [Required]
        public int ServiceId { get; set; }
        [Required, Column(TypeName = "Date")]
        public DateTime AppointmentDate { get; set; }
        [Required]
        public DateTime StartDateTime { get; set; }  // New property for appointment start
        [Required]
        public DateTime EndDateTime { get; set; }  // New property for appointment end
        [Required]
        public int DoctorId { get; set; }
        [Required]
        public int PatientId { get; set; }

    }
}
