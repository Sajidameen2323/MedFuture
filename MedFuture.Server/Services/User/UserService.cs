
using FirebaseAdmin.Auth;
using MedFuture.Server.Database;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;
using MedFuture.Server.Services.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace MedFuture.Server.Services.User
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _dbcontext;
        private readonly IEmailService _emailService;

        public UserService(ApplicationDbContext dbcontext, IEmailService emailService)
        {

            _dbcontext = dbcontext;
            _emailService = emailService;

        }

        public async Task<UserM?> GetUser(string firebaseId)
        {
            try
            {
                // Use FirstOrDefault instead of First to handle the case where no user is found
                UserM? user = _dbcontext.Users.Where(u => u.FirebaseID == firebaseId).FirstOrDefault();

                if (user == null)
                {
                    // User not found, return null
                    return null;
                }
                else
                {
                    // User found, return the user
                    return user;
                }
            }
            catch (DbUpdateException ex) // Catch specific EF exceptions
            {
                // Handle potential database connection timeout or other EF-related issues
                throw new Exception("An error occurred while retrieving the user. Please try again later.", ex); // Re-throw a more informative exception
            }
            catch (SqlException ex) when (ex.Number == -2) // Check for timeout error code
            {
                // Handle timeout exception

                throw new Exception("Database timeout occurred: " + ex.Message);
                // You can retry the operation with increased timeout or provide a fallback behavior
            }
            catch (Exception ex) // Catch general exceptions
            {
                // Catch unexpected exceptions (not recommended for production)
                throw new Exception("An unexpected error occurred. Please try again later.", ex);  // Re-throw a more informative exception
            }


        }
        public async Task<PatientM?> GetPatient(int userId)
        {
            try
            {
                // Use FirstOrDefault instead of First to handle the case where no user is found
                PatientM? patient = _dbcontext.Patients.Where(p => p.UserID == userId).FirstOrDefault();

                if (patient == null)
                {
                    // User not found, return null
                    return null;
                }
                else
                {
                    // User found, return the user
                    return patient;
                }
            }
            catch (DbUpdateException ex) // Catch specific EF exceptions
            {
                // Handle potential database connection timeout or other EF-related issues
                throw new Exception("An error occurred while retrieving the user. Please try again later.", ex); // Re-throw a more informative exception
            }
            catch (SqlException ex) when (ex.Number == -2) // Check for timeout error code
            {
                // Handle timeout exception

                throw new Exception("Database timeout occurred: " + ex.Message);
                // You can retry the operation with increased timeout or provide a fallback behavior
            }
            catch (Exception ex) // Catch general exceptions
            {
                // Catch unexpected exceptions (not recommended for production)
                throw new Exception("An unexpected error occurred. Please try again later.", ex);  // Re-throw a more informative exception
            }


        }
        public async Task<string> GetCustomToken(UserM user, string uid)
        {

            string definedRole = user.Role.ToString();
            // Retrieve user ID from Firebase authentication token

            // Set custom claims using Firebase Admin SDK
            // (This requires Firebase Admin SDK to be configured in your .NET Core app)

            var additionalClaims = new Dictionary<string, object> {

                            { "role", definedRole },
                            { "userIdDb", user.UserID },

                        };

            string customToken = await FirebaseAuth.DefaultInstance
                                  .CreateCustomTokenAsync(uid, additionalClaims);

            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, additionalClaims);

            return customToken;

        }

        public async Task<UserM> CreateUserFromGoogleAuth(PatientCreateFromGoogleAuthDto patientData)
        {


            UserM user = new UserM()
            {
                Email = patientData.Email,
                FirebaseID = patientData.FirebaseID,
                FirstName = patientData.FirstName,
                LastName = patientData.LastName,
                ProfilePic = patientData.ProfilePic,
                Role = patientData.Role
            };

            PatientM patient = new PatientM() { DOB = patientData.DOB, Gender = patientData.Gender, User = user, UserID = user.UserID };

            _dbcontext.Add(user);
            _dbcontext.Add(patient);
            await _dbcontext.SaveChangesAsync();

            return user;


        }


        public async Task<PatientM> CreatePatient(PatientCreateDto patientDto)
        {

            var properties = typeof(PatientCreateDto).GetProperties();
            string output = string.Join(", ", properties.Select(p => $"{p.Name}: {p.GetValue(patientDto)}"));

            Console.WriteLine(output);

            // Map DTO to UserM
            UserM user = new UserM()
            {
                Email = patientDto.Email,
                FirstName = patientDto.FirstName,
                LastName = patientDto.LastName,
                ProfilePic = ""
            };
            PatientM patient = new PatientM() { DOB = patientDto.DOB, Gender = patientDto.Gender };


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

        public async Task<DoctorM> CreateDoctor(DoctorCreateDto doctorDto)
        {
            var properties = typeof(DoctorCreateDto).GetProperties();
            string output = string.Join(", ", properties.Select(p => $"{p.Name}: {p.GetValue(doctorDto)}"));

            Console.WriteLine(output);

            // Map DTO to UserM
            UserM user = new UserM()
            {
                Email = doctorDto.Email,
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                ProfilePic = ""
            };
            DoctorM doctor = new DoctorM() { };

            UserRecordArgs args = new UserRecordArgs()
            {
                Email = doctorDto.Email,
                Password = doctorDto.Password,
            };
            UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);
            try
            {
                user.FirebaseID = userRecord.Uid;
                user.Role = UserRole.Doctor;

                doctor.User = user;
                doctor.UserID = user.UserID;

                _dbcontext.Add(user);
                _dbcontext.Add(doctor);
                await _dbcontext.SaveChangesAsync();

            }
            catch (DbUpdateException ex)
            {
                await FirebaseAuth.DefaultInstance.DeleteUserAsync(userRecord.Uid);
                Console.WriteLine("Successfully deleted user.");
                throw new Exception("Email might be already in use, Try logging in", ex);
            }

            return doctor;
        }

        public int GetUserDbIdFromToken(IEnumerable<Claim> userClaims)
        {
            var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "userIdDb");

            // Access the userId value
            string userId = userIdClaim.Value;
            int userIdDb = Convert.ToInt32(userId);

            return userIdDb;


        }
    }
}
