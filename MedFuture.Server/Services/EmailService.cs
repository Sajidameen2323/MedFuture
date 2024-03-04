
using System.Net.Mail;

namespace MedFuture.Server.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmail(string email, string subject, string body)
        {
            using var client = new SmtpClient("smtp.your-email-provider.com", 587);
            MailAddress from = new MailAddress("jane@contoso.com",
               "Jane " + (char)0xD8 + " Clayton",
            System.Text.Encoding.UTF8);
            MailAddress to = new MailAddress(email);

            
            Console.WriteLine("Email Service Working - "+ body);
        }
    }
}
