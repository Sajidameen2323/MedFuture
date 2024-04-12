using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("get-time-slots")]
        public async Task<ObjectResult> GetTimeSlots()
        {
            DateTime startTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 9, 0, 0); // 9 am
            DateTime endTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 17, 0, 0); // 5 pm

            List<string> timeSlots = new List<string>();

            DateTime currentTime = startTime;

            TimeSpan interval = TimeSpan.FromMinutes(30);

            // Define booked time slots
            List<(DateTime, DateTime)> bookedTimeSlots = new List<(DateTime, DateTime)>();
            bookedTimeSlots.Add((new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 9, 30, 0), new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 10, 0, 0))); // 9:30 am - 10 am
            bookedTimeSlots.Add((new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 14, 0, 0), new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 14, 30, 0)));

            // Loop through time slots
            while (currentTime < endTime)
            {
                bool isBooked = false;

                // Check if the current time slot falls within any booked range
                foreach (var bookedSlot in bookedTimeSlots)
                {
                    if (currentTime >= bookedSlot.Item1 && currentTime < bookedSlot.Item2)
                    {
                        isBooked = true;
                        break;
                    }
                }

                // If the current time slot is not booked, add it to the list of available slots
                if (!isBooked)
                {
                    //timeSlots.Add(currentTime.ToString("hh:mm tt"));
                    DateTime endTimeSlot = currentTime.Add(interval);
                    timeSlots.Add($"{currentTime.ToString("hh:mm tt")} - {endTimeSlot.ToString("hh:mm tt")}");

                }

                currentTime = currentTime.Add(interval);
            }


            return Ok(timeSlots);

        }

    }
}
