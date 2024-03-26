using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MedFuture.Server.Models
{
    [Table("Service")]
    public class ServiceM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceID { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public int Duration { get; set; } = 15;

        public decimal ServiceCharge { get; set; } = 0;

        // Navigation property for the relationship with Doctor
        public ICollection<DoctorServiceM> DoctorServices { get; set; }
    }
}
