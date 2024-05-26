using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    public class DoctorQualificationM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int QualificationId { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [ForeignKey("DoctorID")]
        public DoctorM Doctor { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(200)]
        public string Institute { get; set; }

        [Required]
        public DateTime AcquiredDate { get; set; }

    }
}