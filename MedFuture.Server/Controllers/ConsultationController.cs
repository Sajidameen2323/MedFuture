using MedFuture.Server.DataTransferObjects.GenerateJson;
using MedFuture.Server.Services.Gemini;
using MedFuture.Server.Services.Translate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static MedFuture.Server.Controllers.WeatherForecastController;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultationController : ControllerBase
    {

        private readonly ITranslationService _translationService;
        private readonly ITextGenerationService _textGenerationService;

        public ConsultationController(ITranslationService translationService, ITextGenerationService textGenerationService)
        {
            _translationService = translationService;
            _textGenerationService = textGenerationService;
        }

        [HttpPost("get-summary")]
        public async Task<IActionResult> GetSummaryFromText([FromBody] TextGenFormRequestDto request)
        {
            try
            {
                var translatedText = request.Text;

                if (request.language != "en-US")
                {
                    translatedText = await _translationService.TranslateTextAsync(translatedText, "en");

                }

                var response = await _textGenerationService.GenerateTextAsync(translatedText);

                Console.WriteLine(response);

                MedicationPrescriptionJsonObject prescription = JsonConvert.DeserializeObject<MedicationPrescriptionJsonObject>(response);

                return Ok(prescription);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }

        }

        private class MedicationPrescriptionJsonObject
        {
            public string Summary { get; set; }
            public List<MedicationJsonObject> Medications { get; set; } = [];
        }

        private class MedicationJsonObject
        {
            public string Name { get; set; }
            public string Instruction { get; set; }
        }
    }



}
