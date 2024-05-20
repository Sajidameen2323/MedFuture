using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedFuture.Server.Models
{
    public class ReminderMedication
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Dosage { get; set; }
        [Required]
        public TimeSpan ReminderTime { get; set; }
        public bool IsActive { get; set; } = true;

        public bool Visible { get; set; } = true;

        [Required]
        public MedicationType Type { get; set; }

        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public PatientM Patient { get; set; }
    }

    public enum MedicationType
    {
        Tablet=1,
        Syrup=2,
        Capsule=3,
        Injection=4,
        Other=5
    }
}
