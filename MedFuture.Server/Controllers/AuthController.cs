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

namespace MedFuture.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly ApplicationDbContext _dbcontext;

        public AuthController(ApplicationDbContext dbContext)
        {
            _dbcontext = dbContext;
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
    }
}
