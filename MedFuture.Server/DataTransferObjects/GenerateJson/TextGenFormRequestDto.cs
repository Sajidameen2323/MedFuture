using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.GenerateJson
{
    public class TextGenFormRequestDto
    {
        [Required]
        public string Text { get; set; }
        [Required]
        public string language { get; set; }
    }
}
