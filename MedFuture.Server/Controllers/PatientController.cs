using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Database.Repositories;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;
using MedFuture.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {

     
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IUserService _userService;


        public PatientController(IAppointmentRepository appointmentRepository, IUserService userService, IPatientRepository patientRepository)
        {
            _appointmentRepository = appointmentRepository;
            _userService = userService;
            _patientRepository = patientRepository;
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpGet("me")]
        public async Task<IActionResult> GetPersonalData()
        {
            var userClaims = User.Claims;
            int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

            PatientM patient = await _patientRepository.GetPersonalData(userIdDb);

            var formattedObject = new {

                firstName= (patient.User.FirstName ?? string.Empty),
                lastName= (patient.User.LastName ?? string.Empty),
                email = patient.User.Email ?? "N/A",
                phoneNumber = patient.PhoneNumber ?? "N/A",
                emergencyNumber = patient.EmergencyNumber ?? "N/A",
                dateOfBirth = patient.DOB ?? null,
                gender = patient.Gender ,
                bloodGroup = patient.BloodGroup,
                profilePictureUrl = patient.User.ProfilePic ?? ""

            };

            return Ok(formattedObject);
        }


        [Authorize("PatientOnlyPolicy")]
        [HttpPut("profile/update")]
        public async Task<IActionResult> UpdateProfile(PatientUpdateFormDto patientUpdateForm)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _patientRepository.UpdateProfile(userIdDb, patientUpdateForm);

                return Ok(new { message = "Successfully Updated!" });
            }
            catch(ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpGet("me/allergies")]
        public async Task<IActionResult> GetAllergies()
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var allergies = await _patientRepository.GetAllergies(userIdDb);

                var formattedData = allergies.Select(allergy => new AllergyDto
                {
                    Id = allergy.AllergyID,
                    Name = allergy.Name,
                    Reaction = allergy.Reaction ?? string.Empty

                }).ToList();

                return Ok(formattedData);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpPost("me/allergies")]
        public async Task<IActionResult> AddAllergy(AllergyDto allergy)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var newAllergy = await _patientRepository.AddAllergy(userIdDb, allergy);

                var formattedAllergy = new { 
                    newAllergy.Name,
                    newAllergy.AllergyID,
                    newAllergy.Reaction
                };

                return Ok(formattedAllergy);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpPut("me/allergies/{allergyId}")]
        public async Task<IActionResult> UpdateAllergy(int allergyId ,AllergyDto allergy)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _patientRepository.UpdateAlelrgy(userIdDb, allergyId, allergy);

                return Ok(new {  message = "Successfully Updated Allergy!"});
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch(UnauthorizedAccessException ex)
            {
                Console.WriteLine(ex.Message);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpDelete("me/allergies/{allergyId}")]
        public async Task<IActionResult> DeleteAllergy(int allergyId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _patientRepository.DeleteAllergy(userIdDb, allergyId);

                return Ok(new { message = "Successfully Deleted Allergy!" });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine(ex.Message);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }


        [Authorize("PatientOnlyPolicy")]
        [HttpGet("me/diagnoses")]
        public async Task<IActionResult> GetDiagnoses()
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var diagnoses = await _patientRepository.GetDiagnoses(userIdDb);

                return Ok(diagnoses);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Invalid Session");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Something Went Wrong!");
            }
        }

    }
}
