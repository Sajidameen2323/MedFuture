using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class PatientCreateDto
    {

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[a-zA-Z\d@#!$%^&*]{8,}$", ErrorMessage = "Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character (@#!)")]
        public string Password { get; set; }

        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        [Required]
        public GenderType Gender { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DOB { get; set; }
    }
}
