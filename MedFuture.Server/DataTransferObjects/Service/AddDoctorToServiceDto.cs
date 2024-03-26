using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Service
{
    public class AddDoctorToServiceDto
    {
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public int ServiceId { get; set; }
    }
}
