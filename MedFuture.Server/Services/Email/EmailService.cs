
using MailKit.Net.Smtp;
using MailKit.Security;
using MedFuture.Server.Options;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.Extensions.Options;
using MimeKit;
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
                    emailBodyBuilder.HtmlBody = string.Format(@"
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        padding: 20px;
                        background-color: #f5f5f5;
                    }}
                    .link {{
                        text-decoration: none;
                        color: #007bff;
                        padding: 5px 10px;
                        background-color: #e8e8e8;
                        border-radius: 5px;
                    }}
                </style>
                <div class=""container"">
                    <h1>Welcome to MedFuture!</h1>
                    <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
                    <a href=""{0}"" class=""link"">Verify Email</a>
                    <p>link : {0}</p>
                    <p>If you did not sign up for an account, please ignore this email.</p>
                </div>", verificationLink);

                    //Console.WriteLine(emailBodyBuilder.ToMessageBody().ToString());

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
