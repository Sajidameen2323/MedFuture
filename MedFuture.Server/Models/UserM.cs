using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.Models
{
    public class UserM
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        [DataType(DataType.Date)]
        public DateTime Dob { get; set; }
        public GenderType? Gender { get; set; }
        public string Email { get; set; }
    }

    public enum GenderType
    {
        [Description("Male")]
        Male = 1,
        [Description("Female")]
        Female = 2
    
    }
}
