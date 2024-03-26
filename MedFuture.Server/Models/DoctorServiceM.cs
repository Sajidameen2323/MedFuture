using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.Models
{
    [Table("DoctorService")]
    public class DoctorServiceM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DoctorServiceID { get; set; }

        public int DoctorID { get; set; }
        public DoctorM Doctor { get; set; } // Navigation property for the relationship

        public int ServiceID { get; set; }
       // public ServiceM Service { get; set; } // Navigation property for the relationship
    }
}
