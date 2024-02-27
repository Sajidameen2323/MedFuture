using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Immutable;
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

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]

        [Authorize]
        public async Task<IEnumerable<WeatherForecast>> Get()
        {
            var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

            Console.WriteLine("---Got Token---");
            Console.WriteLine(accessToken);

            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            UserRecord user = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            Console.WriteLine(user.CustomClaims["role"]);

            FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

            Console.WriteLine(decoded.Claims.ToString());
            foreach (var kvp in decoded.Claims)
            {
                Console.WriteLine($"Key: {kvp.Key}, Value: {kvp.Value}");
            }

            object isAdmin;
            if (decoded.Claims.TryGetValue("role", out isAdmin))
            {
                Console.WriteLine("---Role Claim---");
                Console.WriteLine(isAdmin.ToString());
            }

            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Authorize]
        [HttpGet("set-custom-claims")]
        public async Task<IActionResult> SetCustomClaims()
        {
            // Retrieve user ID from Firebase authentication token
            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


            // Set custom claims using Firebase Admin SDK
            // (This requires Firebase Admin SDK to be configured in your .NET Core app)
            // Example:
             var additionalClaims = new Dictionary<string, object> { { "role", "admin" } };

            string customToken = await FirebaseAuth.DefaultInstance
                                              .CreateCustomTokenAsync(uid, additionalClaims);

            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, additionalClaims);
            this.dummyToken = customToken;

            return Ok(new { Message = "Custom claims set successfully", newToken= customToken });
        }


    }
}
