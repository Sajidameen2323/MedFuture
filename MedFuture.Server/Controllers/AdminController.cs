using Microsoft.AspNetCore.Authorization;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using MedFuture.Server.Database;
using MedFuture.Server.Models;
using FirebaseAdmin;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Services.User;
using MedFuture.Server.DataTransferObjects.Payment;

namespace MedFuture.Server.Controllers
{
    [Authorize("AdminOnlyPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ILogger<AdminController> _logger;
        private readonly ApplicationDbContext _dbcontext;
        private readonly IUserService _userService;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IStatisticsRepository _statisticsRepository;

        public AdminController(ILogger<AdminController> logger, ApplicationDbContext dbcontext, IUserService userService,
            IDoctorRepository doctorRepository, IAppointmentRepository appointmentRepository, IPaymentRepository paymentRepository, IStatisticsRepository statisticsRepository)
        {
            _logger = logger;
            _dbcontext = dbcontext;
            _userService = userService;
            _doctorRepository = doctorRepository;
            _appointmentRepository = appointmentRepository;
            _paymentRepository = paymentRepository;
            _statisticsRepository = statisticsRepository;
        }


        [HttpPost("create-doctor")]
        public async Task<IActionResult> CreateDoctor(DoctorCreateDto doctorCreateDto)
        {
            try
            {
                DoctorM doctor =  await _userService.CreateDoctor(doctorCreateDto);

                return Ok(new CreateDoctorResponse<DoctorM> { Success=true, Message="Successfully Registered!"});
            }
            catch (FirebaseException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new CreateDoctorResponse<DoctorM> { Message = "Email is already registered" });
            }
            catch (Exception ex)
            {
                return BadRequest(new CreateDoctorResponse<DoctorM> { Message = ex.Message });
            }
        }
        class CreateDoctorResponse<T>
        {
            public bool Success { get; set; } = false;
            public string Message { get; set; }
            public T Data { get; set; }
        }


        [HttpPost("add-payment")]
        public async Task<IActionResult> AddPaymentForAppointment(AddPaymentDto paymentDto)
        {
            try
            {
                PaymentM payment = await _paymentRepository.AddPayment(paymentDto);

                return Ok(new { message = "Successfully Added Payment!", payment = new { payment.PaymentId, payment.PaymentDate, payment.Amount } });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error = "Invalid Appointment Id" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }


        [HttpGet("stats/get-revenue")]
        public async Task<IActionResult> GetRevenueStatistics()
        {
            try
            {
                var stats = await _statisticsRepository.GetRevenueStatisticsDataAsync();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

        [HttpGet("stats/get-general")]
        public async Task<IActionResult> GetGeneralStatistics()
        {
            try
            {
                var stats = await _statisticsRepository.GetGeneralStatisticsDataAsync();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

        [HttpGet("stats/get-todays-apps")]
        public async Task<IActionResult> GetTodaysAppointmentsForStat()
        {
            try
            {
                var stats = await _statisticsRepository.GetTodaysAppsStatAsync();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

        [HttpGet("stats/get-this-year-appointments")]
        public async Task<IActionResult> GetThisYearAppointmentsMonthCounts()
        {
            try
            {
                var stats = await _statisticsRepository.GetThisYearAppointmentsMonthCounts();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

        [HttpGet("stats/appointments-by-age-group")]
        public async Task<IActionResult> GetThisYearAppointmentsByAgeGroup()
        {
            try
            {
                var stats = await _statisticsRepository.GetAppointmentsByAgeGroupAsync();

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something Went Wrong!");
            }
        }

    }
}
