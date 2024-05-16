using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedFuture.Server.Models
{
    public class ConsultationM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(1500)]
        public string Summary { get; set; }

        [MaxLength(1500)]
        public string AdditionalNote { get; set; }

        [Required]
        public int AppointmentId { get; set; }

        [ForeignKey("AppointmentId")]
        public AppointmentM Appointment { get; set; }

        public ICollection<MedicationM> Medications { get; set; }
    }

    public class MedicationM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        [MaxLength(750)]
        public string Instruction { get; set; }

        [Required]
        public int ConsultationId { get; set; }

        [ForeignKey("ConsultationId")]
        public ConsultationM Consultation { get; set; }
    }

}
