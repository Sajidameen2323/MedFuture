using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.User
{

    public class PasswordChangeDto
    {

        [Required]
        [StringLength(50, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[a-zA-Z\d@#!$%^&*]{8,}$", ErrorMessage = "Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character (@#!)")]
        public string NewPassword { get; set; }

        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; }

    }

}

