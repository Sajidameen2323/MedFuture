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
using System.Globalization;
using MedFuture.Server.Services.User;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        private readonly ILogger<AppointmentController> _logger;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IServiceRepository _serviceRepository;

        private readonly IUserService _userService;

        public AppointmentController(ILogger<AppointmentController> logger, IAppointmentRepository appointmentRepository, IDoctorRepository doctorRepository , IServiceRepository serviceRepository ,IUserService userService)
        {
            _logger = logger;
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
            _serviceRepository = serviceRepository;
            _userService = userService;
        }

        [HttpGet("settings")]
        public async Task<IActionResult> GetAppointmentSettings()
        {
            var settings = await _appointmentRepository.GetAppointmentSettings();

            return Ok(settings);
        }

        [HttpGet("holidays")]
        public async Task<IActionResult> GetUpcomingHolidays()
        {
            var holidays = await _appointmentRepository.GetUpcomingHolidays();

            return Ok(holidays);
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPost("holidays")]
        public async Task<IActionResult> AddHoliday(HolidayDto holiday)
        {
            try
            {
                await _appointmentRepository.AddHoliday(holiday);
                return Ok(new { message = "Successfully Added Holiday!" });
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message="Something Went Wrong!" });
            }
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpDelete("holidays/{id}")]
        public async Task<IActionResult> RemoveHoliday(int id)
        {
            try
            {
                await _appointmentRepository.RemoveHoliday(id);
                return Ok(new { message = "Successfully Removed Holiday!" });
            }
            catch(ArgumentException aex)
            {
                Console.WriteLine(aex.Message);
                return BadRequest(new { message = "Invalid Holiday Id" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "Something Went Wrong!" });
            }
        }


        [Authorize("AdminOnlyPolicy")]
        [HttpPut("settings")]
        public async Task<IActionResult> UpdateAppointmentSettings([FromBody] AppointmentSettingsDto settings)
        {
            try
            {
                Console.WriteLine("---------------------");
                Console.WriteLine(settings.MinimumTimeBeforeBookingInDays);

                AppointmentSettingsM newSettings = new AppointmentSettingsM()
                {
                    MinimumTimeBeforeBookingInDays = settings.MinimumTimeBeforeBookingInDays,
                    MinimumTimeBeforeCancelingInDays = settings.MinimumTimeBeforeCancelingInDays,
                    MinimumTimeBeforeReschedulingInDays = settings.MinimumTimeBeforeReschedulingInDays,
                    BookingPeriodInDays = settings.BookingPeriodInDays,
                    AppointmentTaxPercentage = settings.AppointmentTaxPercentage
                };

                await _appointmentRepository.UpdateAppointmentSettingsAsync(newSettings);
                return Ok(new { message = "Successfully Updated Settings!" });
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "Something Went Wrong!" });

            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpPost("create-appointment")]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto createAppointmentDto)
        {
            try
            {
                var userClaims = User.Claims;

                var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "userIdDb");

               // var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

                // FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

               // object userId;
               // if (decoded.Claims.TryGetValue("userIdDb", out userId))
               if(userIdClaim != null)
                {
                    string userId = userIdClaim.Value;

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
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error = true, message = "Slot is already booked" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error=true, message = "Something Went Wrong" });
            }
        }

        [HttpGet("get-appointment-schedule")]
        public async Task<IActionResult> GetAppointmentSchedule(int docId, int serviceId)
        {

            try
            {
                IEnumerable<AppointmentM> appointments = await _appointmentRepository.GetAppointmentsForNextSchedule(docId);

                AppointmentSettingsM appointmentSettings = await _appointmentRepository.GetAppointmentSettings();

                IEnumerable<HolidayM> holidays = await _appointmentRepository.GetUpcomingHolidays();

                Console.WriteLine("Appointments Count : ");
                Console.WriteLine(appointments.Count());

                DoctorM? doc = await _doctorRepository.GetDoctorByIdAsync(docId);
                ServiceM service = await _serviceRepository.GetService(serviceId);


                if(doc == null)
                {
                    return BadRequest(new { error = "Invalid Doctor Selection" });
                }

                if (service == null)
                {
                    return BadRequest(new { error = "Invalid Service Selection" });
                }

                var doctorWorkingSchedules = await _appointmentRepository.GetNotWorkingDaysForDoctor(docId);

                var doctorWorkingHours = doc.WorkingHours;

                var invalidWeeklyDaysString = "";

                foreach(DoctorWorkDayScheduleM doctorWorkDaySchedule in doctorWorkingSchedules) {

                    Console.WriteLine(GetTwoLetterDayOfWeekCode(doctorWorkDaySchedule.DayOfWeek) +" - "+ doctorWorkDaySchedule.IsWorkingDay);

                    invalidWeeklyDaysString += GetTwoLetterDayOfWeekCode(doctorWorkDaySchedule.DayOfWeek)+" ";


                }
                invalidWeeklyDaysString = string.Join(",", invalidWeeklyDaysString.Trim().Split(' '));

                // Define start and end working hours for doctor
                TimeSpan? nullableStartTime = doctorWorkingHours.StartTime;
                TimeSpan startTime = nullableStartTime ?? TimeSpan.Parse("09:00 AM");

                TimeSpan? nullableEndTime = doctorWorkingHours.EndTime;
                TimeSpan endTime = nullableEndTime ?? TimeSpan.Parse("05:00 PM");


                int? nullableDuration = service.Duration;
                // Define slot duration
                TimeSpan slotDuration = TimeSpan.FromMinutes(nullableDuration ?? 30);

                // Calculate the number of slots
                int totalSlots = 0;
                TimeSpan currentTime = startTime;
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

                var weeklyInvalid = new { repeat = "weekly", weekDays= invalidWeeklyDaysString };

                return Ok(new { 

                    groupedAppointments, weeklyInvalid, 
                    doctorWorkingHours = new { doctorWorkingHours.StartTime, doctorWorkingHours.EndTime },
                    settings = appointmentSettings,
                    holidays

                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }

        }

        private static string GetTwoLetterDayOfWeekCode(DayOfWeek dayOfWeek)
        {
            switch (dayOfWeek)
            {
                case DayOfWeek.Sunday:
                    return "SU";
                case DayOfWeek.Monday:
                    return "MO";
                case DayOfWeek.Tuesday:
                    return "TU";
                case DayOfWeek.Wednesday:
                    return "WE";
                case DayOfWeek.Thursday:
                    return "TH";
                case DayOfWeek.Friday:
                    return "FR";
                case DayOfWeek.Saturday:
                    return "SA";
                default:
                    return "";
            }
        }


        //Admin Only Routes ---------------------------------
        [Authorize("AdminOnlyPolicy")]
        [HttpGet("get-appointments")]
        public async Task<IActionResult> GetAppointments(string startDate, string endDate)
        {
            // Parse start and end dates (assuming format is YYYY-MM-DD)
            DateTime parsedStartDate;
            if (!DateTime.TryParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedStartDate))
            {
                return BadRequest("Invalid start date format. Please use YYYY-MM-DD");
            }

            DateTime parsedEndDate;
            if (!DateTime.TryParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedEndDate))
            {
                return BadRequest("Invalid end date format. Please use YYYY-MM-DD");
            }

            IEnumerable<AppointmentM> appointments = await _appointmentRepository.GetAppointmentsForDateRange(parsedStartDate, parsedEndDate);
            var appSettings = await _appointmentRepository.GetAppointmentSettings();

            var outputObject = appointments.Select(a => new { 

                a.AppointmentId,
                a.AppointmentDate,
                a.StartDateTime,
                a.EndDateTime,
    
                service = new { a.Service.Name, a.Service.Duration  },
                doctor = new { a.Doctor.User.FirstName, a.Doctor.User.LastName, a.Doctor.User.ProfilePic, name = a.Doctor.User.GetFullName() },
                patient = new { a.Patient.User.FirstName, a.Patient.User.LastName, a.Patient.User.Email, a.Patient.PhoneNumber, a.Patient.User.ProfilePic },
                status = Enum.GetName(typeof(AppointmentStatus), a.Status),
                payment = new {
                    a.PaymentId,
                    amount = (a?.Payment?.Amount != null && a?.Payment?.TaxAmount != null) ? (a?.Payment?.Amount - a?.Payment.TaxAmount) : null,
                    paymentStatus = a.PaymentId.HasValue ? "Paid" : "Pending",
                    paymentMode = a?.Payment == null ? null : Enum.GetName(typeof(PaymentMode), a?.Payment.PaymentMode),
                    canAddPayment = a.Status != AppointmentStatus.Cancelled && a.Status != AppointmentStatus.Missed,
                    canViewInvoice = a.PaymentId.HasValue ? true : false,
                    taxPercentage = (a?.Payment?.Amount != null && a?.Payment?.TaxAmount != null) ? Math.Round((decimal)(a.Payment.TaxAmount / (a.Payment.Amount - a.Payment.TaxAmount)), 2) : 0m
                },
                price = a?.Service.ServiceCharge,
                tax = appSettings?.AppointmentTaxPercentage ?? 0,

            }).ToList();

            return Ok(value: new { outputObject });
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteAppointments([FromBody] DeleteAppointmentsRequest request)
        {
            if (request == null || request.AppointmentIdList == null || !request.AppointmentIdList.Any())
            {
                return BadRequest("AppointmentIdList cannot be null or empty.");
            }

            // Process request.AppointmentIdList
            try
            {
                var deletedCount = await _appointmentRepository.DeleteAppointmentsByIdList(request.AppointmentIdList);
                return Ok($"Deleted {deletedCount} appointments.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPut("update-status")]
        public async Task<IActionResult> BulkUpdateAppointmentStatus([FromBody] BulkUpdateRequest request)
        {
            if (request == null || request.AppointmentIdList == null || !request.AppointmentIdList.Any())
            {
                return BadRequest("AppointmentIdList cannot be null or empty.");
            }

            if (!Enum.IsDefined(typeof(AppointmentStatus), request.NewStatus))
            {
                return BadRequest("Invalid newStatus value.");
            }

            try
            {
                var updatedCount = await _appointmentRepository.BulkUpdateAppointmentStatus(request.AppointmentIdList, request.NewStatus);
                return Ok($"Updated {updatedCount} appointments.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
