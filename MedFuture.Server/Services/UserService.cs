
using FirebaseAdmin.Auth;
using MedFuture.Server.Database;
using MedFuture.Server.DataTransferObjects;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


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

        public async Task<UserM?> GetUser(string firebaseId)
        {
            try
            {
                UserM user = _dbcontext.Users
                     .Where(u => u.FirebaseID == (string)firebaseId)
                     .First();
                return user;
            }
            catch (Exception ex) {
                return null;
            }
            
        }

        public async Task<string> GetCustomToken(UserM user, string uid)
        {

            string definedRole = ((UserRole)user.Role).ToString();
            // Retrieve user ID from Firebase authentication token

            // Set custom claims using Firebase Admin SDK
            // (This requires Firebase Admin SDK to be configured in your .NET Core app)

            var additionalClaims = new Dictionary<string, object> {

                            { "role", definedRole },

                        };

            string customToken = await FirebaseAuth.DefaultInstance
                                  .CreateCustomTokenAsync(uid, additionalClaims);

            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, additionalClaims);

            return customToken;

        }

        public async Task<UserM> CreateUserFromGoogleAuth(PatientCreateFromGoogleAuthDto patientData)
        {

       
                UserM user = new UserM() { Email=patientData.Email, FirebaseID = patientData.FirebaseID, FirstName = patientData.FirstName,
                LastName = patientData.LastName, ProfilePic= patientData.ProfilePic, Role=patientData.Role};

                PatientM patient = new PatientM() { DOB = patientData.DOB, Gender = patientData.Gender, User=user, UserID=user.UserID };

                _dbcontext.Add(user);
                _dbcontext.Add(patient);
                await _dbcontext.SaveChangesAsync();

                return user;
            

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
