using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class PatientUpdateFormDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        [DataType(DataType.Date)]
        [Required]
        public DateTime DateOfBirth { get; set; }

        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Invalid emergency number")]
        public string? EmergencyNumber { get; set; }

        [Required]
        public GenderType? Gender { get; set; }

        [Required]
        public BloodGroupType? BloodGroup { get; set; }
    }
}
