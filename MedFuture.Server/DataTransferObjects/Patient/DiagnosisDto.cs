using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class DiagnosisDto
    {
        public int? Id { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime DiagnosisDate { get; set; }

    }
}
