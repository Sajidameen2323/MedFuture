using FirebaseAdmin.Auth;
using MedFuture.Server.Database;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedFuture.Server.Services;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        private readonly ILogger<AppointmentController> _logger;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserService _userService;

        public AppointmentController(ILogger<AppointmentController> logger, IAppointmentRepository appointmentRepository, IUserService userService)
        {
            _logger = logger;
            _appointmentRepository = appointmentRepository;
            _userService = userService;
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpPost("create-appointment")]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto createAppointmentDto)
        {
            try
            {
                var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

                FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

                object userId;
                if (decoded.Claims.TryGetValue("userIdDb", out userId))
                {
                    Console.Write("User DB ID - ");
                    Console.WriteLine(userId.GetType());
                    Console.Write(userId);
                    int userIdDb = Convert.ToInt32(userId);
                    Console.Write(" Casted Successfully ");

                    PatientM? user = await _userService.GetPatient(userIdDb);
                    if (user != null)
                    {
                      
                        Console.WriteLine("Patient Id -");
                        Console.WriteLine(user.PatientID);
                        createAppointmentDto.PatientId = user.PatientID;
                    }
                    else
                    {
                        return BadRequest(new { Message="Cannot Find user" });
                    }
                }
                else
                {
                    return BadRequest(new { Message = "Not Authorized" });

                }

                AppointmentM appointment = await _appointmentRepository.CreateAppointment(createAppointmentDto);

                return Ok(new { data = appointment, message="Successfully Booked Appointment!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(new { error=true, message = "Something Went Wrong" });
            }
        }

        [HttpGet("get-appointment-schedule")]
        public async Task<IActionResult> GetAppointmentSchedule()
        {
            try
            {
                IEnumerable<AppointmentM> appointments = await _appointmentRepository.GetAppointmentsForNextTwoWeeks();

                Console.WriteLine("Appointments Count : ");
                Console.WriteLine(appointments.Count());

                DateTime startTime = DateTime.Parse("09:00 AM");
                DateTime endTime = DateTime.Parse("05:00 PM");

                // Define slot duration
                TimeSpan slotDuration = TimeSpan.FromMinutes(30);

                // Calculate the number of slots
                int totalSlots = 0;
                DateTime currentTime = startTime;
                while (currentTime < endTime)
                {
                    totalSlots++;
                    currentTime = currentTime.Add(slotDuration);
                }

                var groupedAppointments = appointments
                    .GroupBy(a => a.AppointmentDate) // Group appointments by AppointmentDate
                    .Select(group => new // Create an anonymous type for each date group
                    {
                        d = group.Key.ToString("yyyy-MM-dd"),
                        nr = totalSlots - group.ToList().Count,
                        invalid = group.Select(a => new // Create "invalid" object for each appointment
                        {
                            start = a.StartDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"), // Format date and time
                            end = a.EndDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ")
                        })// Convert the appointment group to a List
                    })
                    .ToList();

                return Ok(groupedAppointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }

        }

    }
}
