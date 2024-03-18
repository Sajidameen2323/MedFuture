using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    public class DoctorSpecialtyM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SpecialtyId { get; set; }

        [Required]
        public int DoctorID { get; set; }

        public string Description { get; set; } = string.Empty;

        public DoctorM Doctor { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }


    }
}