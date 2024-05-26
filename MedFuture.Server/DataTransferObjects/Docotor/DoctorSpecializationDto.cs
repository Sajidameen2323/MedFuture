using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Docotor
{
    public class DoctorSpecializationDto
    {
        public int? Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }
    }
}
