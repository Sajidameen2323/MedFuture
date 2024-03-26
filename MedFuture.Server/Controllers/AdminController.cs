using Microsoft.AspNetCore.Authorization;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using MedFuture.Server.Services;
using MedFuture.Server.Database;
using MedFuture.Server.Models;
using FirebaseAdmin;
using MedFuture.Server.DataTransferObjects.Docotor;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ILogger<AdminController> _logger;
        private readonly ApplicationDbContext _dbcontext;
        private readonly IUserService _userService;

        public AdminController(ILogger<AdminController> logger, ApplicationDbContext dbcontext, IUserService userService)
        {
            _logger = logger;
            _dbcontext = dbcontext;
            _userService = userService;
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPost("create-doctor")]
        public async Task<IActionResult> CreateDoctor(DoctorCreateDto doctorCreateDto)
        {
            try
            {
                DoctorM doctor =  await _userService.CreateDoctor(doctorCreateDto);
                return Ok(new CreateDoctorResponse<DoctorM> { Success=true, Message="Successfully Registered!", Data=doctor});
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
    }
}
