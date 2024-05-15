using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Database.Repositories;
using MedFuture.Server.DataTransferObjects.Consultation;
using MedFuture.Server.DataTransferObjects.GenerateJson;
using MedFuture.Server.Services.Gemini;
using MedFuture.Server.Services.Translate;
using MedFuture.Server.Services.User;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IConsultationRepository _consultationRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserService _userService;

        public ConsultationController(ITranslationService translationService, ITextGenerationService textGenerationService,
            IConsultationRepository consultationRepository, IUserService userService, IAppointmentRepository appointmentRepository)
        {
            _translationService = translationService;
            _textGenerationService = textGenerationService;
            _consultationRepository = consultationRepository;
            _userService = userService;
            _appointmentRepository = appointmentRepository;
        }

        [Authorize("DoctorOnlyPolicy")]
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

        [Authorize("DoctorOnlyPolicy")]
        [HttpPost("add-consultation")]
        public async Task<IActionResult> AddConsultation([FromBody] ConsultationRequest consultationRequest)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _consultationRepository.AddOrUpdateConsultationAsync(userIdDb, consultationRequest);

                await _appointmentRepository.UpdateAppointmentStatusForDoctor(consultationRequest.AppointmentId, userIdDb, AppointmentStatus.Completed);

                return Ok(new { message = "Success" });
            }
            catch(ArgumentException ex)
            {
                return BadRequest("Invalid Session");
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine(ex.Message);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
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
