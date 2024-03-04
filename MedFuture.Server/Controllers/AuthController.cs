using Azure.Core;
using FirebaseAdmin.Auth;
using MedFuture.Server.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MedFuture.Server.Models;
using MedFuture.Server.DataTransferObjects;
using MedFuture.Server.Services;
using FirebaseAdmin.Messaging;
using Microsoft.Data.SqlClient;
using FirebaseAdmin;

namespace MedFuture.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;
        private readonly ApplicationDbContext _dbcontext;
        private readonly IMyDependency _myDependency;
        private readonly IUserService _userService;

        public AuthController(ApplicationDbContext dbContext, ILogger<AuthController> logger, IMyDependency myDependency, IUserService userService)
        {
            _dbcontext = dbContext;
            _logger = logger;
            _myDependency = myDependency;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("authorize-user")]
        public async Task<IActionResult> AuthorizeUser()
        {
            var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");
            
            FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

            object userId;
            if (decoded.Claims.TryGetValue("user_id", out userId))
            {
                try
                {
                    UserM user = _dbcontext.Users
                        .Where(u => u.FirebaseID == (string)userId)
                        .First();
                 
                    if(user != null) 
                    {
                        string definedRole = ((UserRole)user.Role).ToString();
               
                        // Retrieve user ID from Firebase authentication token
                        var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        // Set custom claims using Firebase Admin SDK
                        // (This requires Firebase Admin SDK to be configured in your .NET Core app)

                        var additionalClaims = new Dictionary<string, object> { 
                            
                            { "role", definedRole },
                            
                        
                        };

                        string customToken = await FirebaseAuth.DefaultInstance
                                                          .CreateCustomTokenAsync(uid, additionalClaims);

                        await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, additionalClaims);


                        return Ok(new { Message = "Custom claims set successfully", newToken = customToken });

                    }
                    else
                    {
                        Console.WriteLine("No user found");
                        return Unauthorized();

                    }
                   
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Catch block");
                    Console.WriteLine(ex.Message);
                    return BadRequest();
                }
            }
            else
            {
                Console.WriteLine("Invalid Token");
                return Unauthorized();
            }

        }

        [HttpPost("create-patient")]
        public async Task<IActionResult> CreatePatient(PatientCreateDto patientCreateDto)
        {
            if (patientCreateDto == null)
            {
                return BadRequest("Invalid patient data");
            }
            try
            {
                PatientM patient = await _userService.CreatePatient(patientCreateDto);
                
                _myDependency.WriteMessage("Index2Model.OnGet");

                return Ok(new CreateResponse<PatientM>
                {
                    Success = true,
                    Message = "Entity created successfully",
                    Data = patient
                });

            }
            catch(FirebaseException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new CreateErrorResponse { Message = "Email is already registered"});
            }
            catch (Exception ex)
            {
                return BadRequest(new CreateErrorResponse { Message = ex.Message });
            }

        }
        class CreateResponse<T>
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public T Data { get; set; }
        }

        class CreateErrorResponse
        {
            public bool Success { get; set; } = false;
            public string Message { get; set; }
           
        }
    }
}
