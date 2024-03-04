using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedFuture.Server.Models
{
    [Table("User")]
    public class UserM
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        public string FirebaseID { get; set; }

        [Required, StringLength(50)]
        public string FirstName { get; set; }

        [Required, StringLength(50)]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public string? ProfilePic { get; set; }

        [Required]
        public UserRole Role { get; set; }
    }

 
    public enum UserRole
    {
        [Description("Admin")]
        Admin =1,
        [Description("Patient")]
        Patient = 2,
        [Description("Doctor")]
        Doctor =3
    }
}
