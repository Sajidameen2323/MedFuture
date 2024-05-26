using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    [Table("DoctorSpecialties")]
    public class DoctorSpecializationM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SpecialtyId { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [ForeignKey("DoctorID")]
        public DoctorM Doctor { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }


    }
}