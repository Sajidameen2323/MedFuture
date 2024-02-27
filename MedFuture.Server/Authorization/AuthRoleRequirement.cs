using Microsoft.AspNetCore.Authorization;

namespace MedFuture.Server.Authorization
{
    public class AuthRoleRequirement: IAuthorizationRequirement
    {
        public string Role { get; }
        public AuthRoleRequirement(string role)
        {
            Role = role;
        }
    }
}
