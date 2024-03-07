using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    [Table("Patient")]
    public class PatientM
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
    }

    public enum GenderType
    {
        [Description("Male")]
        Male = 1,
        [Description("Female")]
        Female = 2

    }
}
