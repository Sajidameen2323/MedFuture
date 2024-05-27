
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
<style>
    body {{
        font-family: sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }}

    .container {{
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        text-align: center;
    }}

    .logo {{
        max-width: 200px;
        margin-bottom: 20px;
    }}

    h1 {{
        color: #333333;
        font-size: 28px;
        margin-bottom: 20px;
    }}

    p {{
        color: #666666;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
    }}

    .verify-button {{
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
    }}

    .verify-button:hover {{
        background-color: #0056b3;
    }}

    .link {{
        color: #007bff;
        text-decoration: none;
        font-weight: bold;
    }}

    .link:hover {{
        text-decoration: underline;
    }}
</style>

<div class=""container"">
    <img src=""cid:{0}"" class=""logo"" alt=""Company Logo"">
    <h1>Welcome to MedFuture!</h1>
    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
    <a href=""{1}"" class=""verify-button"">Verify Email</a>
    <p>If you prefer, you can also use the following link: <a href=""{1}"" class=""link"">{1}</a></p>
    <p>If you did not sign up for an account, please ignore this email.</p>
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
<style>
    body {{
        font-family: sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }}

    .container {{
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        text-align: center;
    }}

    .logo {{
        max-width: 200px;
        margin-bottom: 20px;
    }}

    h1 {{
        color: #333333;
        font-size: 28px;
        margin-bottom: 20px;
    }}

    p {{
        color: #666666;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
    }}

    .reset-button {{
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
    }}

    .verify-button:hover {{
        background-color: #0056b3;
    }}

    .link {{
        color: #007bff;
        text-decoration: none;
        font-weight: bold;
    }}

    .link:hover {{
        text-decoration: underline;
    }}
</style>

<div class=""container"">
    <img src=""cid:{0}"" class=""logo"" alt=""Company Logo"">
    <h1>Welcome to MedFuture!</h1>
    <p>Please reset your password by clicking the button below:</p>
    <a href=""{1}"" class=""reset-button"">Reset Password</a>
    <p>If you prefer, you can also use the following link: <a href=""{1}"" class=""link"">{1}</a></p>
    <p>If you did not request a password reset mail, please ignore this email.</p>
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
    }
}
