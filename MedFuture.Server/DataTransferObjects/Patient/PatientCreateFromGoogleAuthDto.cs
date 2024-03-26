using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class PatientCreateFromGoogleAuthDto
    {
        [Required]
        public string FirebaseID { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public GenderType? Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        public string? ProfilePic { get; set; }

        [Required]
        public UserRole Role { get; set; }
    }
}
