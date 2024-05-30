namespace MedFuture.Server.Services.Email
{
    public interface IEmailService
    {

        public Task SendEmail(string email, string subject, string body);
        public Task<bool> SendVerificationEmail(string email, string verificationLink);
        public Task<bool> SendPasswordResetEmail(string email, string verificationLink);

        Task SendBulkEmailsAsync(List<string> recipients, string subject, Dictionary<string, string> emailBodies);
    }
}
