using Azure;
using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.GenerateJson;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Services.Email;
using MedFuture.Server.Services.Gemini;
using MedFuture.Server.Services.Translate;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Immutable;
using System.Globalization;
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
        private readonly ITranslationService _translationService;
        private readonly ITextGenerationService _textGenerationService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IEmailService emailService, IServiceRepository serviceRepository, ITranslationService translationService,
            ITextGenerationService textGenerationService)
        {
            _logger = logger;
            _emailService = emailService;
            _serviceRepository = serviceRepository;
            _translationService = translationService;
            _textGenerationService = textGenerationService;
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

 
    }
}
