using FirebaseAdmin.Auth;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MedFuture.Server.Authorization
{
    public class AuthRoleHandler: AuthorizationHandler<AuthRoleRequirement>
    {

        protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, AuthRoleRequirement requirement)
        {
            //var accessToken = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

            //Console.WriteLine("---Got Token---");
            //Console.WriteLine(accessToken);

            //var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //UserRecord user = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            //Console.WriteLine(user.CustomClaims["role"]);

            //FirebaseToken decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(accessToken);

            //Console.WriteLine(decoded.Claims.ToString());
            //foreach (var kvp in decoded.Claims)
            //{
            //    Console.WriteLine($"Key: {kvp.Key}, Value: {kvp.Value}");
            //}

            //object isAdmin;
            //if (decoded.Claims.TryGetValue("role", out isAdmin))
            //{
            //    Console.WriteLine("---Role Claim---");
            //    Console.WriteLine(isAdmin.ToString());
            //}
            //var roleClaim = context.User.FindFirst("role");

            var uid = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (uid != null)
            {
                UserRecord user = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);

                var roleClaim = user.CustomClaims["role"];

                //Console.WriteLine("Role In Handler - "+ roleClaim);

                if (roleClaim != null && (string)roleClaim == requirement.Role)
                {
                    Console.WriteLine("Succeeded");
                    context.Succeed(requirement);
                }
            }


            return Task.CompletedTask;
        }

    }
}
