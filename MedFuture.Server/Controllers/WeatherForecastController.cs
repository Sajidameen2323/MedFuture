using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Immutable;
using System.Security.Claims;

namespace MedFuture.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    
    public class WeatherForecastController : ControllerBase
    {

        public string dummyToken = "";

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IEmailService _emailService;
        private readonly IServiceRepository _serviceRepository;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IEmailService emailService, IServiceRepository serviceRepository)
        {
            _logger = logger;
            _emailService = emailService;
            _serviceRepository = serviceRepository;
        }

        [HttpGet(Name = "GetWeatherForecast")]

        [Authorize("AdminOnlyPolicy")]
        public async Task<IEnumerable<WeatherForecast>> Get()
        {

            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }


        [HttpGet("get-email-dummy")]
        public async Task<IActionResult> GetEmailDummy()
        {
            await _emailService.SendVerificationEmail("slimshady0632@gmail.com", "Email Verification");

            return Ok();
           
        }

        [HttpGet("get-services")]
        public async Task<IActionResult> GetServices()
        {
            var obj = await _serviceRepository.GetAllServices();

            return Ok(obj);

        }
        [HttpGet("get-doctors-for-service/{id}")]
        public async Task<IActionResult> GetDoctorsForService(int id)
        {
            var obj = await _serviceRepository.GetDoctorsForService(id);

            return Ok(obj);

        }

        [HttpPost("add-service")]
        public async Task<IActionResult> AddService(ServiceDto serviceDto)
        {
            var obj = await _serviceRepository.AddService(serviceDto);

            return Ok(obj);

        }
        [HttpPost("add-doctor-to-service")]
        public async Task<IActionResult> AddDoctorToService(AddDoctorToServiceDto addDoctorToService)
        {
            await _serviceRepository.AddDoctorToService(addDoctorToService.DoctorId, addDoctorToService.ServiceId);

            return Ok(new { status="success" });

        }
    }
}
