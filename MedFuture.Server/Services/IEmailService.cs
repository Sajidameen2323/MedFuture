namespace MedFuture.Server.Services
{
    public interface IEmailService
    {

        public Task SendEmail(string email, string subject, string body);
        public Task<bool> SendVerificationEmail(string email, string verificationLink);
    }
}
