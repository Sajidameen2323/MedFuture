using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Docotor
{
    public class DoctorQualificationDto
    {

        public int? Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(200)]
        public string Institute { get; set; }

        [Required]
        public DateTime AcquiredDate { get; set; }
    }
}
