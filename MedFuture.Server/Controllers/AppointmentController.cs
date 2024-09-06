
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using MedFuture.Server.Services.User;
using Microsoft.AspNetCore.RateLimiting;
using System.Data.Common;
using MedFuture.Server.Services.Email;

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
        private readonly IEmailService _emailService;

        public AppointmentController(ILogger<AppointmentController> logger, IAppointmentRepository appointmentRepository, IDoctorRepository doctorRepository,
            IServiceRepository serviceRepository, IUserService userService, IEmailService emailService)
        {
            _logger = logger;
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
            _serviceRepository = serviceRepository;
            _userService = userService;
            _emailService = emailService;
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
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "Something Went Wrong!" });
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
            catch (ArgumentException aex)
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
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "Something Went Wrong!" });

            }
        }

        [Authorize("PatientOnlyPolicy")]
        [EnableRateLimiting("BookingAppointmentLimiter")]
        [HttpPost("create-appointment")]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto createAppointmentDto)
        {

            try
            {

                // Check if date falls under appointment booking schedule
                DateTime formDateTime = createAppointmentDto.StartDateTime;
                var app_settings = await _appointmentRepository.GetAppointmentSettings();

                int min_offset_before_booking = app_settings.MinimumTimeBeforeBookingInDays;
                int booking_period = app_settings.BookingPeriodInDays;

                // Calculate the allowed booking period range
                DateTime minBookingDate = DateTime.Now.AddDays(min_offset_before_booking).Date;
                DateTime maxBookingDate = DateTime.Now.AddDays(booking_period).Date;

                Console.WriteLine("----------------------");
                Console.WriteLine(minBookingDate.ToString());
                Console.WriteLine(maxBookingDate.ToString());
                Console.WriteLine(formDateTime.ToString());

                // Check if the appointment date is within the allowed range
                if (formDateTime < minBookingDate || formDateTime > maxBookingDate)
                {
                    return BadRequest($"Appointment must be booked at least {min_offset_before_booking} days in advance and within the next {booking_period} days.");
                }

                var userClaims = User.Claims;

                var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "userIdDb");

                // var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

                // FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

                // object userId;
                // if (decoded.Claims.TryGetValue("userIdDb", out userId))


                if (userIdClaim != null)
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
                        return BadRequest(new { Message = "Cannot Find user" });
                    }
                }
                else
                {
                    return BadRequest(new { Message = "Not Authorized" });

                }

                AppointmentM appointment = await _appointmentRepository.CreateAppointment(createAppointmentDto);
        

                return Ok(new { data = appointment, message = "Successfully Booked Appointment!", tax = app_settings.AppointmentTaxPercentage });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error = true, message = "Slot is already booked" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error = true, message = "Something Went Wrong" });
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


                if (doc == null)
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

                foreach (DoctorWorkDayScheduleM doctorWorkDaySchedule in doctorWorkingSchedules)
                {

                    Console.WriteLine(GetTwoLetterDayOfWeekCode(doctorWorkDaySchedule.DayOfWeek) + " - " + doctorWorkDaySchedule.IsWorkingDay);

                    invalidWeeklyDaysString += GetTwoLetterDayOfWeekCode(doctorWorkDaySchedule.DayOfWeek) + " ";


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
                            end = a.EndDateTime.AddMinutes(-1).ToString("yyyy-MM-ddTHH:mm:ssZ")
                        })// Convert the appointment group to a List
                    })
                    .ToList();

                var weeklyInvalid = new { repeat = "weekly", weekDays = invalidWeeklyDaysString };

                return Ok(new
                {

                    groupedAppointments,
                    weeklyInvalid,
                    doctorWorkingHours = new { doctorWorkingHours.StartTime, EndTime = doctorWorkingHours.EndTime.Subtract(TimeSpan.FromMinutes(1)) },
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

            var outputObject = appointments.Select(a => new
            {

                a.AppointmentId,
                a.AppointmentDate,
                a.StartDateTime,
                a.EndDateTime,

                service = new { a.Service.Name, a.Service.Duration },
                doctor = new { a.Doctor.User.FirstName, a.Doctor.User.LastName, a.Doctor.User.ProfilePic, name = a.Doctor.User.GetFullName() },
                patient = new { a.Patient.User.FirstName, a.Patient.User.LastName, a.Patient.User.Email, a.Patient.PhoneNumber, a.Patient.User.ProfilePic },
                status = Enum.GetName(typeof(AppointmentStatus), a.Status),
                payment = new
                {
                    a.PaymentId,
                    amount = a?.Payment?.Amount ?? null,
                    paymentStatus = a.PaymentId.HasValue ? "Paid" : "Pending",
                    paymentMode = a?.Payment == null ? null : Enum.GetName(typeof(PaymentMode), a?.Payment.PaymentMode),
                    canAddPayment = a.Status != AppointmentStatus.Cancelled && a.Status != AppointmentStatus.Missed,
                    canViewInvoice = a.PaymentId.HasValue ? true : false,
                    taxPercentage = a?.Payment?.TaxRate ?? null,
                    additionalCost = a?.Payment?.AdditionalCost ?? null,
                    total = a?.Payment?.TotalCost ?? null,
                    TaxAmount = a?.Payment?.TaxAmount ?? null,
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
                var updatedApps = await _appointmentRepository.BulkUpdateAppointmentStatus(request.AppointmentIdList, request.NewStatus);

                if (request.sendEmail)
                {
                    Console.WriteLine("------Sending Emails-------");

                    var subject = "Appointment Update";
                    var recipients = new List<string>();
                    var emailBodies = new Dictionary<string, string>();

                    var groupedApps = updatedApps.GroupBy(a => a.Patient.User.Email);

                    foreach (var group in groupedApps)
                    {

                        var emailBody = $@"
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset=""UTF-8"">
                                        <title>Appointment Status Update</title>
                                        <style>
                                            body {{
                                                font-family: Arial, sans-serif;
                                                font-size: 14px;
                                                line-height: 1.5;
                                                color: #333333;
                                            }}
                                            h1 {{
                                                font-size: 24px;
                                                color: #007bff;
                                                margin-bottom: 20px;
                                            }}
                                            .info-box {{
                                                background-color: #f8f9fa;
                                                border: 1px solid #dee2e6;
                                                padding: 20px;
                                                margin-bottom: 20px;
                                            }}
                                            .info-box p {{
                                                margin: 0;
                                            }}
                                            .info-box p:not(:last-child) {{
                                                margin-bottom: 10px;
                                            }}
                                        </style>
                                    </head>
                                    <body>
                                        <h1>Appointment Status Update</h1>

                                        <div class=""info-box"">
                                            <p>Dear Patient,</p>
                                            <p>The status of your appointments has been updated.</p>
                                        </div>

                                        {string.Join("", group.Select(app => $@"
                                        <div class=""info-box"">
                                            <p><strong>Appointment Details:</strong></p>
                                            <p>Doctor: {app.Doctor.User.GetFullName()}</p>
                                            <p>Date: {app.AppointmentDate.ToString("D")}</p>
                                            <p>Time: {app.StartDateTime.ToString("h:mm tt")}</p>
                                            <p>Status: {request.NewStatus}</p>
                                        </div>
                                        "))}

                                        <div class=""info-box"">
                                            <p>If you have any further inquiries or need assistance, please contact MedFuture.</p>
                                            <p>Thank you for choosing our services.</p>
                                        </div>
                                    </body>
                                    </html>
                                    ";

                        recipients.Add(group.Key);
                        emailBodies.Add(group.Key, emailBody);
                    }

                    await _emailService.SendBulkEmailsAsync(recipients, subject, emailBodies);
                }

                return Ok($"Updated {updatedApps.Count()} appointments.");
            }
            catch (DbException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Failed To Update Status");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

    }
}
