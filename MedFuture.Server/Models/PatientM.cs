using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    [Table("Patient")]
    public class PatientM: ISoftDeleteBase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PatientID { get; set; }

        [Required]
        public int UserID { get; set; }
        public UserM User { get; set; } // Navigation property for the relationship

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        public GenderType? Gender { get; set; }

        [RegularExpression(@"^(0|[1-9]\d{9})$",
                           ErrorMessage = "Phone number must be 10 digits starting with 0 or 9 (without leading 0).")]
        public string? PhoneNumber { get; set; }

        [RegularExpression(@"^(0|[1-9]\d{9})$",
                   ErrorMessage = "Emergency number must be 10 digits starting with 0 or 9 (without leading 0).")]
        public string? EmergencyNumber { get; set; }

        public BloodGroupType? BloodGroup { get; set; }

        public ICollection<AllergyM> Allergies { get; set; }

        public ICollection<DiagnosisM> Diagnoses { get; set; }

        public ICollection<ReminderMedication> reminderMedications { get; set; }

        public bool IsDeleted { get; set; } = false;
    }

    public enum GenderType
    {
        [Description("Male")]
        Male = 1,
        [Description("Female")]
        Female = 2

    }

    public enum BloodGroupType
    {
        [Description("A+")]
        APositive = 1,
        [Description("A-")]
        ANegative = 2,
        [Description("B+")]
        BPositive = 3,
        [Description("B-")]
        BNegative = 4,
        [Description("AB+")]
        ABPositive = 5,
        [Description("AB-")]
        ABNegative = 6,
        [Description("O+")]
        OPositive = 7,
        [Description("O-")]
        ONegative = 8
    }

    public class AllergyM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AllergyID { get; set; }

        [Required]
        public string Name { get; set; }


        public string? Reaction { get; set; } = "";

        [Required]
        public int PatientID { get; set; }

        [ForeignKey("PatientID")]
        public PatientM Patient { get; set; }
    }

    [Table("Diagnosis")]
    public class DiagnosisM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DiagnosisID { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime DiagnosisDate { get; set; }

        [Required]
        public int PatientID { get; set; }

        [ForeignKey("PatientID")]
        public PatientM Patient { get; set; }
    }

}
