
using FirebaseAdmin.Auth;
using MedFuture.Server.Database;
using MedFuture.Server.DataTransferObjects;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin.Messaging;


namespace MedFuture.Server.Services
{
    public class UserService: IUserService
    {
        private readonly ApplicationDbContext _dbcontext;
        private readonly IEmailService _emailService;

        public UserService(ApplicationDbContext dbcontext, IEmailService emailService) { 
        
            _dbcontext = dbcontext;
            _emailService = emailService;
    
        }

        public async Task<PatientM> CreatePatient( PatientCreateDto patientDto)
        {
           
            var properties = typeof(PatientCreateDto).GetProperties();
            string output = string.Join(", ", properties.Select(p => $"{p.Name}: {p.GetValue(patientDto)}"));

            Console.WriteLine(output);

            // Map DTO to UserM
            UserM user = new UserM() { Email=patientDto.Email, FirstName = patientDto.FirstName,
            LastName = patientDto.LastName, ProfilePic = ""};
            PatientM patient = new PatientM() { DOB= patientDto.DOB, Gender = patientDto.Gender };


            UserRecordArgs args = new UserRecordArgs()
            {
                Email = patientDto.Email,
                Password = patientDto.Password,
            };
            UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);
            try
            {
                user.FirebaseID = userRecord.Uid;
                user.Role = UserRole.Patient;

                patient.User = user;
                patient.UserID = user.UserID;

                _dbcontext.Add(user);
                _dbcontext.Add(patient);
                await _dbcontext.SaveChangesAsync();

                var actionCodeSettings = new ActionCodeSettings()
                {
                    Url = "https://localhost:5173/",
                    HandleCodeInApp = true,
                    //IosBundleId = "com.example.ios",
                    //AndroidPackageName = "com.example.android",
                    //AndroidInstallApp = true,
                    //AndroidMinimumVersion = "12",
                 
                };

                var email = userRecord.Email;
                var link = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(
                    email, actionCodeSettings);
                // Construct email verification template, embed the link and send
                // using custom SMTP server.

                await _emailService.SendVerificationEmail(email, link);

            }
            catch (DbUpdateException ex)
            {
                await FirebaseAuth.DefaultInstance.DeleteUserAsync(userRecord.Uid);
                Console.WriteLine("Successfully deleted user.");
                throw new Exception("Email might be already in use, Try logging in", ex);
            }


            return patient;
        }
    }
}
