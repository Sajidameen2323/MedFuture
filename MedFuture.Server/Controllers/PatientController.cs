using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Database.Repositories;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;
using MedFuture.Server.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {

     
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IUserService _userService;
        private readonly IMedicationReminderRepository _medicationReminderRepository;


        public PatientController(IAppointmentRepository appointmentRepository, IUserService userService, IPatientRepository patientRepository, IMedicationReminderRepository medicationReminderRepository )
        {
            _appointmentRepository = appointmentRepository;
            _userService = userService;
            _patientRepository = patientRepository;
            _medicationReminderRepository = medicationReminderRepository;
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

                var formattedData = diagnoses.Select(diagnosis => new DiagnosisDto
                {
                    Id = diagnosis.DiagnosisID,
                    Name = diagnosis.Name,
                    DiagnosisDate = diagnosis.DiagnosisDate,

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
        [HttpPost("me/diagnoses")]
        public async Task<IActionResult> AddDiagnosis(DiagnosisDto diagnosis)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var newDiagnosis = await _patientRepository.AddDiagnosis(userIdDb, diagnosis);

                var formattedDiagnosis = new {
                    
                    newDiagnosis.DiagnosisID,
                    newDiagnosis.Name,
                    newDiagnosis.DiagnosisDate
                
                };

                return Ok(formattedDiagnosis);
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
        [HttpPut("me/diagnoses/{diagnosisId}")]
        public async Task<IActionResult> UpdateDiagnosis(int diagnosisId, DiagnosisDto diagnosis)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _patientRepository.UpdateDiagnosis(userIdDb, diagnosisId, diagnosis);

                return Ok(new { message = "Successfully Updated Diagnosis!" });
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
        [HttpDelete("me/diagnoses/{diagnosisId}")]
        public async Task<IActionResult> DeleteDiagnosis(int diagnosisId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _patientRepository.DeleteDiagnosis(userIdDb, diagnosisId);

                return Ok(new { message = "Successfully Deleted Diagnosis!" });
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
        [HttpGet("me/appointments")]
        public async Task<IActionResult> GetMyAppointments(string startDate, string endDate)
        {
            // Parse start and end dates (assuming format is YYYY-MM-DD)
            DateTime parsedStartDate;
            if (!DateTime.TryParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedStartDate))
            {
                return BadRequest("Invalid start date format. Please use YYYY-MM-DD");
            }

            DateTime parsedEndDate;
            if (!DateTime.TryParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedEndDate))
            {
                return BadRequest("Invalid end date format. Please use YYYY-MM-DD");
            }

            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var apps = await _appointmentRepository.GetAppointmentsForPatient(userIdDb,parsedStartDate, parsedEndDate);

                var formattedObj = apps.OrderByDescending(a=> a.AppointmentDate).Select(a => new { 
                
                    a.AppointmentId,
                    a.AppointmentDate,
                    a.Service.Name,
                    status = Enum.GetName(typeof(AppointmentStatus), a?.Status),
                    a.StartDateTime,
                    EndDateTime = a.StartDateTime.AddMinutes(a.Service.Duration),
                    Doctor = new {
                    
                        name = a.Doctor.User.GetFullName(),
                        profilePicture = a.Doctor.User.ProfilePic,
                        email = a.Doctor.User.Email
                    }
                });

                return Ok(formattedObj);
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
        [HttpGet("appointments/{appId}/details")]
        public async Task<IActionResult> GetAppointmentDetails(int appId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);


                var app = await _appointmentRepository.GetAppointmentDetailsForPatient(appId, userIdDb);
                var app_settings = await _appointmentRepository.GetAppointmentSettings();
                DateTime earliestRescheduleDate = DateTime.Now.AddDays(app_settings.MinimumTimeBeforeReschedulingInDays);
                DateTime earliestCancelDate = DateTime.Now.AddDays(app_settings.MinimumTimeBeforeCancelingInDays);

                var obj = new
                    {
                        app.AppointmentId,
                        doctor = new {
                            id = app.Doctor.DoctorID,
                            name = app.Doctor.User.GetFullName(),
                            email = app.Doctor.User.Email

                        },
                    patient = new { app.Patient.User.FirstName, app.Patient.User.LastName },
                    consultation = app.Consultation == null ? null : new
                        {
                            app.Consultation.Summary,
                            app.Consultation.AdditionalNote,
                            medications = app.Consultation.Medications.Select(m => new
                            {
                                m.Name,
                                m.Instruction
                            }) ?? []
                        },
                        hasPayment = app.PaymentId.HasValue,
                    payment =  new
                    {
                        PaymentId = app?.Payment?.PaymentId ?? null,  // Replace 0 with default value for PaymentId
                        Amount = (app?.Payment?.Amount != null && app?.Payment?.TaxAmount != null) ? (app?.Payment?.Amount - app?.Payment.TaxAmount) : null,    // Replace 0.0 with default value for Amount
                        PaymentDate = app?.Payment?.PaymentDate ?? null, // Or a suitable default date
                        paymentMode = app?.Payment == null ? null : Enum.GetName(typeof(PaymentMode), app?.Payment.PaymentMode),
                        taxPercentage = (app?.Payment?.Amount != null && app?.Payment?.TaxAmount != null) ? Math.Round((decimal)(app.Payment.TaxAmount / (app.Payment.Amount - app.Payment.TaxAmount)), 4) : 0m
                    },
                        service = new {
                            app.Service.Name,
                            app.Service.ServiceID,
                            app.Service.Duration,
                        },

                        status = Enum.GetName(typeof(AppointmentStatus), app?.Status),
                        app.StartDateTime,
                        app.AppointmentDate,
                        EndDateTime = app.StartDateTime.AddMinutes(app.Service.Duration),
                        canRescedule = app.AppointmentDate > DateOnly.FromDateTime(earliestRescheduleDate),
                        canCancel = app.AppointmentDate > DateOnly.FromDateTime(earliestCancelDate)
       
                };

                    return Ok(obj);

            }
            catch (ArgumentException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized("Resource not authorized");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something Went Wrong!" });
            }

        }

        [Authorize("PatientOnlyPolicy")]
        [HttpPut("appointments/{appId}/cancel")]
        public async Task<IActionResult> CancelAppointment(int appId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _appointmentRepository.UpdateAppointmentStatusForPatient(appId, userIdDb, AppointmentStatus.Cancelled);

                return Ok();

            }
            catch (ArgumentException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized("Resource not authorized");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something Went Wrong!" });
            }
        }


        [Authorize("PatientOnlyPolicy")]
        [HttpPut("appointments/{appId}/reschedule")]
        public async Task<IActionResult> RescheduleAppointment(int appId, AppRescheduleDto appRescheduleDto)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _appointmentRepository.RescheduleAppointment(appId, userIdDb, appRescheduleDto.StartDateTime);

                return Ok(new {message="Successfully Rescheduled Appointment!"});

            }
            catch (ArgumentException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized("Resource not authorized");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something Went Wrong!" });
            }
        }

        [Authorize("PatientOnlyPolicy")]
        [HttpGet("me/medication-reminders")]
        public async Task<IActionResult> GetReminders()
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var reminders = await _medicationReminderRepository.GetAllAsync(userIdDb);

                var formattedData = reminders.Select(reminder => new MedicationReminderDto
                {
                    Id = reminder.Id,
                    Name = reminder.Name,
                    Dosage = reminder.Dosage,
                    ReminderTime = reminder.ReminderTime,
                    IsActive = reminder.IsActive,
                    MedicationType = reminder.Type,
                    Visible = reminder.Visible,

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
        [HttpPost("me/medication-reminders")]
        public async Task<IActionResult> AddReminder(MedicationReminderDto medicationReminderDto)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var reminder =  await _medicationReminderRepository.AddAsync(userIdDb, medicationReminderDto);

                var formattedObj = new {
                    
                    reminder.Id,
                    reminder.Name,
                    reminder.Dosage,
                    reminder.ReminderTime,
                    reminder.IsActive,
                    reminder.Type,
                    reminder.Visible
                
                };

                return Ok(new { message = "Successfully Added Reminder!", data = formattedObj });
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
        [HttpPut("me/medication-reminders/{reminderId}")]
        public async Task<IActionResult> UpdateReminder(int reminderId,MedicationReminderDto medicationReminderDto)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var reminder = await _medicationReminderRepository.UpdateAsync(userIdDb,reminderId,medicationReminderDto);

                var formattedObj = new
                {

                    reminder.Id,
                    reminder.Name,
                    reminder.Dosage,
                    reminder.ReminderTime,
                    reminder.IsActive,
                    reminder.Type,
                    reminder.Visible

                };

                return Ok(new { message = "Successfully Updated Reminder!", data = formattedObj });
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
        [HttpDelete("me/medication-reminders/{reminderId}")]
        public async Task<IActionResult> DeleteReminder(int reminderId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _medicationReminderRepository.DeleteAsync(userIdDb, reminderId);


                return Ok(new { message = "Successfully Deleted Reminder!" });
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


    }
}
