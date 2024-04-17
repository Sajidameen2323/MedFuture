using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.Models
{
    [Table("Doctor")]
    public class DoctorM : ISoftDeleteBase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DoctorID { get; set; }

        [Required]
        [ForeignKey("UserM")]
        public int UserID { get; set; }

        public UserM User { get; set; } // Navigation property for the relationship

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        public GenderType? Gender { get; set; }

        [RegularExpression(@"^(0|[1-9]\d{9})$",
                   ErrorMessage = "Phone number must be 10 digits starting with 0 or 9 (without leading 0).")]
        public string? PhoneNumber { get; set; }

        public List<DoctorSpecialtyM>? Specialties { get; set; }

        public List<DoctorQualificationM>? Qualifications { get; set;}

        // Navigation property for the relationship with Doctor
        //  public ICollection<DoctorServiceM> DoctorServices { get; set; }


        public bool IsDeleted { get; set; } = false;

    }
}
