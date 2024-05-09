using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class AllergyDto
    {

        public int? Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Reaction { get; set; } = "";
    }
}
