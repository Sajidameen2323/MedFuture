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
using MedFuture.Server.Services;
using FirebaseAdmin.Messaging;
using Microsoft.Data.SqlClient;
using FirebaseAdmin;
using MedFuture.Server.DataTransferObjects.Patient;


namespace MedFuture.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;
        private readonly ApplicationDbContext _dbcontext;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;

        public AuthController(ApplicationDbContext dbContext, ILogger<AuthController> logger, IUserService userService, IEmailService emailService)
        {
            _dbcontext = dbContext;
            _logger = logger;
            _userService = userService;
            _emailService = emailService;
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
                UserRecord userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync((string)userId);

                string? signInMethod = "password";

                var firstProviderInfo = userRecord.ProviderData[0];

                signInMethod = firstProviderInfo.ProviderId;

                try
                {
                    UserM? user = await _userService.GetUser((string)userId);

                    if (user != null) 
                    {
                                    
                        // Retrieve user ID from Firebase authentication token
                        var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        string customToken = await _userService.GetCustomToken(user, (string)uid);

                        return Ok(new { Message = "Custom claims set successfully", newToken = customToken });

                    }
                    else if (user == null && signInMethod == "google.com")
                    {
                        Console.WriteLine("No user found, Creating user from google sign in");

                        PatientCreateFromGoogleAuthDto patientCreateFromGoogleAuth = new PatientCreateFromGoogleAuthDto();
                        patientCreateFromGoogleAuth.FirebaseID = userRecord.Uid;
                        patientCreateFromGoogleAuth.FirstName = firstProviderInfo.DisplayName.Split(" ")[0];
                        patientCreateFromGoogleAuth.LastName = firstProviderInfo.DisplayName.Split(" ")[1];
                        patientCreateFromGoogleAuth.Email = firstProviderInfo.Email;
                        patientCreateFromGoogleAuth.ProfilePic = firstProviderInfo.PhotoUrl;
                        patientCreateFromGoogleAuth.Role = UserRole.Patient;

                        UserM dbUser = await _userService.CreateUserFromGoogleAuth(patientCreateFromGoogleAuth);
                        var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        string customToken = await _userService.GetCustomToken(dbUser, (string)uid);

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

                return Ok(new CreatePatientResponse<PatientM>
                {
                    Success = true,
                    Message = "Entity created successfully",
                    Data = patient
                });

            }
            catch(FirebaseException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new CreatePatientResponse<PatientM> { Message = "Email is already registered"});
            }
            catch (Exception ex)
            {
                return BadRequest(new CreatePatientResponse<PatientM> { Message = ex.Message });
            }

        }
        class CreatePatientResponse<T>
        {
            public bool Success { get; set; } = false;
            public string Message { get; set; }
            public T Data { get; set; }
        }




        // Verification Email Sending Area
        [Authorize]
        [HttpGet("get-verification-mail")]
        public async Task<IActionResult> GetVerificationEmail()
        {
            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            UserRecord userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            var actionCodeSettings = new ActionCodeSettings()
            {
                Url = "https://localhost:5173/",
                HandleCodeInApp = true,
                //IosBundleId = "com.example.ios",
                //AndroidPackageName = "com.example.android",
                //AndroidInstallApp = true,
                //AndroidMinimumVersion = "12",

            };
            var link = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(
                    userRecord.Email, actionCodeSettings);

            bool emailSent = await _emailService.SendVerificationEmail(userRecord.Email, link);

            if (emailSent)
            {
                return Ok(new VerficationMailResponse { Success=true, Message="Verification Email Sent!"});
            }

            return BadRequest(new VerficationMailResponse { Message="Something Went Wrong"});
           
        }

        class VerficationMailResponse
        {
            public bool Success { get; set; } = false;
            public string Message { get; set; }
        
        }

    }
}
