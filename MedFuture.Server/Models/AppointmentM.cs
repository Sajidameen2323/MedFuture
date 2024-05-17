using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace MedFuture.Server.Models
{
    public class AppointmentM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentId { get; set; }

        public int ServiceId { get; set; }
        public ServiceM Service { get; set; }  // Navigation property for Service

        public DateOnly AppointmentDate { get; set; }

        public DateTime StartDateTime { get; set; }  // New property for appointment start

        public DateTime EndDateTime { get; set; }  // New property for appointment end

        public int DoctorId { get; set; }
        public DoctorM Doctor { get; set; }  // Navigation property for Doctor

        public int PatientId { get; set; }
        public PatientM Patient { get; set; }  // Navigation property for Patient

        public int? ConsultationId { get; set; }

        [ForeignKey("ConsultationId")]
        public ConsultationM Consultation { get; set; }

        public int? PaymentId { get; set; }

        [ForeignKey("PaymentId")]
        public PaymentM Payment { get; set; }

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    }
}
public enum AppointmentStatus
{
    Pending=1,
    Cancelled=2,
    Missed=3,
    Completed=4,
}