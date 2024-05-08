using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Database.Repositories;
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

                name = (patient.User.FirstName ?? "N/A") + " " + (patient.User.LastName ?? "N/A"),
                email = patient.User.Email ?? "N/A",
                phoneNumber = patient.PhoneNumber ?? "N/A",
                emergencyNumber = patient.EmergencyNumber ?? "N/A",
                dateOfBirth = patient.DOB ?? DateTime.MinValue,
                gender = patient.Gender ,
                bloodGroup = patient.BloodGroup,
                profilePictureUrl = patient.User.ProfilePic ?? ""

            };

            return Ok(formattedObject);
        }

    }
}
