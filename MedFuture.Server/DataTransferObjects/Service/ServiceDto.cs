using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Service
{
    public class ServiceDto
    {
        public int? Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int Duration { get; set; } = 15;

        [Required]
        public decimal ServiceCharge { get; set; } = 0;
    }
}
