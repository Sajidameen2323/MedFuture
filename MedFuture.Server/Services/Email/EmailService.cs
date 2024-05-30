
using MailKit.Net.Smtp;
using MailKit.Security;
using MedFuture.Server.Options;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Utils;
using Org.BouncyCastle.Asn1.Pkcs;
using static System.Net.Mime.MediaTypeNames;


namespace MedFuture.Server.Services.Email
{
    public class EmailService(IOptions<MailOptions> mailOptions) : IEmailService
    {
        private readonly MailOptions _mailOptions = mailOptions.Value;

        public async Task SendEmail(string email, string subject, string body)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailOptions.SenderName, _mailOptions.SenderEmail);
                    emailMessage.From.Add(emailFrom);
                    MailboxAddress emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);
                    emailMessage.Subject = subject;

                    BodyBuilder emailBodyBuilder = new BodyBuilder();
                    //emailBodyBuilder.TextBody = body;
                    emailBodyBuilder.HtmlBody = string.Format(@"<p>Hey Alice,<br>
                          <p>What are you up to this weekend? Monica is throwing one of her parties on
                          Saturday and I was hoping you could make it.<br>
                          <p>Will you be my +1?<br>
                          <p>-- Joey<br>
                          <center><img src=""cid:{0}""></center>", "kaaham");

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();

                    //this is the SmtpClient from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        mailClient.Connect(_mailOptions.Server, _mailOptions.Port, SecureSocketOptions.StartTls);
                        mailClient.Authenticate(_mailOptions.UserName, _mailOptions.Password);
                        mailClient.Send(emailMessage);
                        mailClient.Disconnect(true);
                    }

                }

                Console.WriteLine("Email Sent Successfully");
            }
            catch (SmtpCommandException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Error trying to connect: {0}", ex.Message);
                Console.WriteLine("\tStatusCode: {0}", ex.StatusCode);
            }
            catch (SmtpProtocolException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Protocol error while trying to connect: {0}", ex.Message);

            }
            catch (AuthenticationException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Invalid user name or password.");

            }
            catch (Exception ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Unknow error - {0}", ex.ToString());
            }

        }

        public async Task<bool> SendVerificationEmail(string email, string verificationLink)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailOptions.SenderName, _mailOptions.SenderEmail);
                    emailMessage.From.Add(emailFrom);

                    MailboxAddress emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = "Verify your email address";

                    BodyBuilder emailBodyBuilder = new BodyBuilder();


                    var logoImageAttachment = emailBodyBuilder.LinkedResources.Add(@"./Services/Email/Assets/logo.png");
                    logoImageAttachment.ContentId = MimeUtils.GenerateMessageId();

                    emailBodyBuilder.HtmlBody = string.Format(@"
<div style=""max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); text-align: center; font-family: Arial, Helvetica, sans-serif;"">
    <img src=""cid:{0}"" style=""max-width: 200px; margin-bottom: 20px;"" alt=""Company Logo"">
    <h1 style=""color: #333333; font-size: 28px; margin-bottom: 20px;"">Welcome to MedFuture!</h1>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">Thank you for signing up. Please verify your email address by clicking the button below:</p>
    <a href=""{1}"" style=""display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-bottom: 20px; transition: background-color 0.3s ease;"">Verify Email</a>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">If you prefer, you can also use the following link: <a href=""{1}"" style=""color: #007bff; text-decoration: none; font-weight: bold;"">{1}</a></p>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">If you did not sign up for an account, please ignore this email.</p>
</div>
", logoImageAttachment.ContentId, verificationLink);

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();

                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        mailClient.Connect(_mailOptions.Server, _mailOptions.Port, SecureSocketOptions.StartTls);
                        mailClient.Authenticate(_mailOptions.UserName, _mailOptions.Password);
                        mailClient.Send(emailMessage);
                        mailClient.Disconnect(true);
                    }

                    Console.WriteLine("Verification email sent successfully.");
                    return true;
                }
            }
            catch (SmtpCommandException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Error trying to connect: {0}", ex.Message);
                Console.WriteLine("\tStatusCode: {0}", ex.StatusCode);
            }
            catch (SmtpProtocolException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Protocol error while trying to connect: {0}", ex.Message);
            }
            catch (AuthenticationException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Invalid user name or password.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Unknow error - {0}", ex.ToString());
            }

            return false;
        }

        public async Task<bool> SendPasswordResetEmail(string email, string verificationLink)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailOptions.SenderName, _mailOptions.SenderEmail);
                    emailMessage.From.Add(emailFrom);

                    MailboxAddress emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = "Reset Password";

                    BodyBuilder emailBodyBuilder = new BodyBuilder();


                    var logoImageAttachment = emailBodyBuilder.LinkedResources.Add(@"./Services/Email/Assets/logo.png");
                    logoImageAttachment.ContentId = MimeUtils.GenerateMessageId();

                    emailBodyBuilder.HtmlBody = string.Format(@"
<div style=""max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); text-align: center; font-family: Arial, Helvetica, sans-serif;"">
    <img src=""cid:{0}"" style=""max-width: 200px; margin-bottom: 20px;"" alt=""Company Logo"">
    <h1 style=""color: #333333; font-size: 28px; margin-bottom: 20px;"">Welcome to MedFuture!</h1>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">Please reset your password by clicking the button below:</p>
    <a href=""{1}"" style=""display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-bottom: 20px; transition: background-color 0.3s ease;"">Reset Password</a>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">If you prefer, you can also use the following link: <a href=""{1}"" style=""color: #007bff; text-decoration: none; font-weight: bold;"">{1}</a></p>
    <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;"">If you did not request a password reset mail, please ignore this email.</p>
</div>
", logoImageAttachment.ContentId, verificationLink);

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();

                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        mailClient.Connect(_mailOptions.Server, _mailOptions.Port, SecureSocketOptions.StartTls);
                        mailClient.Authenticate(_mailOptions.UserName, _mailOptions.Password);
                        mailClient.Send(emailMessage);
                        mailClient.Disconnect(true);
                    }

                    Console.WriteLine("Password Reset email sent successfully.");
                    return true;
                }
            }
            catch (SmtpCommandException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Error trying to connect: {0}", ex.Message);
                Console.WriteLine("\tStatusCode: {0}", ex.StatusCode);
            }
            catch (SmtpProtocolException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Protocol error while trying to connect: {0}", ex.Message);
            }
            catch (AuthenticationException ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Invalid user name or password.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!!Could Not Send -");
                Console.WriteLine("Unknow error - {0}", ex.ToString());
            }

            return false;
        }

        public Task SendBulkEmailsAsync(List<string> recipients, string subject, Dictionary<string, string> emailBodies)
        {
            var tasks = new List<Task>();
            foreach (var recipient in recipients)
            {
                tasks.Add(SendEmailAsync(recipient, subject, emailBodies));
            }

            // Return immediately without waiting for all tasks to complete
            return Task.CompletedTask;
        }


        private async Task SendEmailAsync(string recipient, string subject, Dictionary<string, string> emailBodies)
        {
            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync(_mailOptions.Server, _mailOptions.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailOptions.UserName, _mailOptions.Password);

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_mailOptions.SenderName, _mailOptions.SenderEmail));
                email.To.Add(new MailboxAddress("", recipient));
                email.Subject = subject;

                if (emailBodies.ContainsKey(recipient))
                {
                    var bodyBuilder = new BodyBuilder();
                    bodyBuilder.HtmlBody = emailBodies[recipient];
                    email.Body = bodyBuilder.ToMessageBody();
                }
                else
                {
                    email.Body = new TextPart("plain") { Text = "No email body provided." };
                }

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
