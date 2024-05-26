using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace MedFuture.Server.Models
{
    [Table("Doctor")]
    public class DoctorM : ISoftDeleteBase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DoctorID { get; set; }

        [Required]
        public int UserID { get; set; }

        [ForeignKey("UserID")]
        public UserM User { get; set; } // Navigation property for the relationship

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        public GenderType? Gender { get; set; }

        [RegularExpression(@"^(0|[1-9]\d{9})$",
                   ErrorMessage = "Phone number must be 10 digits starting with 0 or 9 (without leading 0).")]
        public string? PhoneNumber { get; set; }

        public List<DoctorSpecializationM>? Specializations { get; set; }

        public List<DoctorQualificationM>? Qualifications { get; set;}

        // Navigation property for the relationship with Doctor
        //  public ICollection<DoctorServiceM> DoctorServices { get; set; }

        public ICollection<DoctorWorkDayScheduleM> WorkDaySchedule { get; set; }

        public DoctorWorkingHours? WorkingHours { get; set; }

        public bool IsDeleted { get; set; } = false;
        
    }

    [Table("DoctorWorkDaySchedule")]
    public class DoctorWorkDayScheduleM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }


        public int DoctorId { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public bool IsWorkingDay { get; set; }

        [ForeignKey("DoctorId")]
        public DoctorM Doctor { get; set; }
    }

    [Table("DoctorWorkingHours")]
    public class DoctorWorkingHours
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }


        [ForeignKey("DoctorId")]
        public DoctorM Doctor { get; set; }
    }

}
