using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using MedFuture.Server.DataTransferObjects.Docotor;
using Microsoft.EntityFrameworkCore;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Services.User;
using MedFuture.Server.Database.Repositories;
using System.Globalization;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {

        private readonly IDoctorRepository _doctorRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserService _userService;

        public DoctorController(IDoctorRepository doctorRepository, IAppointmentRepository appointmentRepository, IUserService userService)
        {
            _doctorRepository = doctorRepository;
            _appointmentRepository = appointmentRepository;
            _userService = userService;
        }

        [HttpGet("doctors/info")]
        public async Task<IActionResult> GetDocorsInfo()
        {
            IEnumerable<DoctorM> doctors = await _doctorRepository.GetAllDoctorsAsync();

            var formattedObject = doctors.Where(d => !d.IsDeleted).Select(d => new { 
            
                name = d.User.GetFullName(),
                profilePic = d.User.ProfilePic,
                qualifications = d?.Qualifications != null ? d.Qualifications.Select(q => new { q.Name }) : [],
                specializations = d?.Specializations != null ? d.Specializations.Select(s => new {  s.Name }): [],
                workingDays = d?.WorkDaySchedule != null ? d.WorkDaySchedule.Where(ws => ws.IsWorkingDay).Select(ws => new { day = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(ws.DayOfWeek) }) : [],
                workingHours = d?.WorkingHours != null ? new { d.WorkingHours.StartTime, d.WorkingHours.EndTime } : null,
            
            });

            return Ok(formattedObject);
        }

        [Authorize("DoctorOnlyPolicy")]
        [HttpGet("me")]
        public async Task<IActionResult> GetPersonalData()
        {
            var userClaims = User.Claims;
            int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

            DoctorM patient = await _doctorRepository.GetPersonalData(userIdDb);

            var formattedObject = new
            {

                firstName = (patient.User.FirstName ?? string.Empty),
                lastName = (patient.User.LastName ?? string.Empty),
                email = patient.User.Email ?? "N/A",
                phoneNumber = patient.PhoneNumber ?? "N/A",
                dateOfBirth = patient.DOB ?? null,
                gender = patient.Gender,
                profilePictureUrl = patient.User.ProfilePic ?? ""

            };

            return Ok(formattedObject);
        }

        [Authorize("DoctorOnlyPolicy")]
        [HttpPut("profile/update")]
        public async Task<IActionResult> UpdateProfile(DoctorUpdateFormDto doctorUpdateForm)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _doctorRepository.UpdateProfile(userIdDb, doctorUpdateForm);

                return Ok(new { message = "Successfully Updated!" });
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

        [Authorize("AdminOnlyPolicy")]
        [HttpGet("doctor/{id}")]
        public async Task<IActionResult> GetDoctor(int id)
        {
            DoctorM? doctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return Ok(doctor);
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpGet("doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

                var list = docList.Select(d => new { d.DoctorID, d.UserID, d.User, d.DOB, d.Gender, d.PhoneNumber,

                    workingHours = new {
                        StartTime = d?.WorkingHours?.StartTime ?? null,
                        EndTime = d?.WorkingHours?.EndTime ?? null

                    } })
                    .ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error="Something Went Wrong!!" });
            }
        }

        [HttpGet("doctors-for-form")]
        public async Task<IActionResult> GetAllDoctorsForForm()
        {

            try
            {
                IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

                var doctorDtoList = docList.Select(doctor => new { doctorID = doctor.DoctorID, name = doctor.User.FirstName + " " + doctor.User.LastName });

                return Ok(doctorDtoList);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error = "Something Went Wrong!!" });
            }


        }

        [Authorize("AdminOnlyPolicy")]
        [HttpDelete("doctors/{id}/disable")]
        public async Task<IActionResult> DisableDoctor(int id)
        {
            try
            {
                await _doctorRepository.DisableDoctorAsync(id);

                return Ok();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something went wrong!");
            }
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPut("doctors/{id}/activate")]
        public async Task<IActionResult> ActivateDoctor(int id)
        {
            try
            {
                await _doctorRepository.ActivateDoctorAsync(id);

                return Ok();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Something went wrong!");
            }
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpGet("doctors/workdayschedule")]
        public async Task<IActionResult> GetDoctorWorkDaySchedule()
        {

            IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

            var formatted = docList.Where(d=> !d.User.IsDeleted).Select(d =>
            {
                var doctorId = d.DoctorID;
                var name = d.User?.FirstName + " " + d.User?.LastName; // Use null-conditional operator

                // Handle null WorkDaySchedule
                var workSchedule = d.WorkDaySchedule?.Select(s => new
                {
                    dayOfWeek = s.DayOfWeek,
                    isWorkingDay = s.IsWorkingDay
                });

                // Handle null workingHours
                var workingHours = d.WorkingHours != null ? new
                {
                    StartTime = d.WorkingHours.StartTime,
                    EndTime = d.WorkingHours.EndTime
                } : new
                {
                    StartTime = new TimeSpan(9, 0, 0), // 9 AM
                    EndTime = new TimeSpan(17, 0, 0)  // 5 PM
                };

                return new
                {
                    DoctorId = doctorId,
                    Name = name,
                    WorkSchedule = workSchedule,
                    WorkingHours = workingHours
                };
            });

            return Ok(new { result = formatted });
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpPost("doctors/update/workdayschedule")]
        public async Task<IActionResult> UpdateDoctorWorkDaySchedule(DoctorWorkDayScheduleupdateDto workDayScheduleDto)
        {
            try
            {
                await _doctorRepository.UpdateDoctorWorkDaySchedule(workDayScheduleDto);
                await _doctorRepository.UpdateDoctorWorkHours(workDayScheduleDto);

                return Ok(new { message="Successfully Updated" });
            }
            catch(Exception ex)
            {
                return BadRequest(new {message=ex.Message });
            }
        }

        [Authorize("DoctorOnlyPolicy")]
        [HttpGet("appointments/today")]
        public async Task<IActionResult> GetTodaysAppointments()
        {
            try
            {
                var userClaims = User.Claims;

                var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "userIdDb");

                if (userIdClaim != null)
                {
                    // Access the userId value
                    string userId = userIdClaim.Value;
                    int userIdDb = Convert.ToInt32(userId);

                    var apps = await _appointmentRepository.GetTodaysAppointmentsForDoctor(userIdDb);

                    List<object> unknownObjects = new List<object>
                    {


                    };

                    foreach (var item in apps)
                    {
                        unknownObjects.Add(
                            new
                            {
                                item.AppointmentId,
                                patient = new
                                {

                                    name = item.Patient.User.FirstName + " " + item.Patient.User.LastName,
                                    profilePicture = item.Patient.User.ProfilePic,
                                    item.Patient.DOB,

                                },
                                item.Service.Name,
                                status = Enum.GetName(typeof(AppointmentStatus), item?.Status),
                                item.StartDateTime,
                                EndDateTime = item.StartDateTime.AddMinutes(item.Service.Duration)
                            }
                             );
                    }
                    return Ok(unknownObjects);

                }
                else
                {
                    return Unauthorized("Invalid Session");
                }
            }
            catch(ArgumentException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch(Exception ex)
            {
                return BadRequest(new {message="Something Went Wrong!"});
            }
 

        }

        [Authorize("DoctorOnlyPolicy")]
        [HttpGet("appointments/{appId}/details")]
        public async Task<IActionResult> GetAppointmentDetails(int appId)
        {
            try
            {
                var userClaims = User.Claims;

                var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "userIdDb");

                if (userIdClaim != null)
                {
                    // Access the userId value
                    string userId = userIdClaim.Value;
                    int userIdDb = Convert.ToInt32(userId);

                    var app = await _appointmentRepository.GetAppointmentDetailsForDoctor(appId,userIdDb);

                    var obj = new
                    {
                        app.AppointmentId,
                        patient = new
                        {
                            name = app.Patient.User.GetFullName(),
                            profilePicture = app.Patient.User.ProfilePic,
                            app.Patient.DOB,
                            bloodGroup = app.Patient.BloodGroup,
                            app.Patient.EmergencyNumber,
                            app.Patient.PhoneNumber,
                            gender = Enum.GetName((GenderType)app.Patient.Gender),
                            allergies = app.Patient.Allergies.Select(a => new AllergyDto
                            {
                                Id = a.AllergyID,
                                Name = a.Name,
                                Reaction = a.Reaction,
                            }) ?? [],
                            diagnoses = app.Patient.Diagnoses.Select(d => new DiagnosisDto
                            {
                                Id = d.DiagnosisID,
                                Name = d.Name,
                                DiagnosisDate = d.DiagnosisDate,
                            }) ?? [],
                            currentMedications = app.Patient.reminderMedications.Where(rm => rm.Visible).Select(rm => new 
                            {
                                id = rm.Id,
                                name = rm.Name,
                                dosage = rm.Dosage,
                            }) ?? [],

                        },
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
                        app.Service.Name,
                        app.Service.Duration,
                        status = Enum.GetName(typeof(AppointmentStatus), app?.Status),
                        app.StartDateTime,
                        EndDateTime = app.StartDateTime.AddMinutes(app.Service.Duration)
                    };

                    return Ok(obj);

                }
                else
                {
                    return Unauthorized("Invalid Session");
                }
            }
            catch (ArgumentException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized("Resource not authorized");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something Went Wrong!" });
            }

        }


        [Authorize("DoctorOnlyPolicy")]
        [HttpPut("appointments/{appId}/status/update")]
        public async Task<IActionResult> UpdateAppointmentStatus(int appId, [FromBody] UpdateAppointmentStatusRequest request)
        {
            if (!Enum.IsDefined(typeof(AppointmentStatus), request.Status))
            {
                return BadRequest($"Invalid status value: {request.Status}");
            }

            var statusName = Enum.GetName(typeof(AppointmentStatus), request.Status);
            
            try
            {
                var userClaims = User.Claims;

                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                AppointmentStatus newStatus = (AppointmentStatus)Enum.Parse(typeof(AppointmentStatus), request.Status.ToString());

                await _appointmentRepository.UpdateAppointmentStatusForDoctor(appId, userIdDb, newStatus);

           
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
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "Something Went Wrong!" });
            }

            return Ok(new { status = statusName });
        }

        [Authorize("DoctorOnlyPolicy")]
        [HttpGet("me/qualifications")]
        public async Task<IActionResult> GetQualifications()
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var qualifications = await _doctorRepository.GetMyQualifications(userIdDb);

                var formattedData = qualifications.Select(qualification => new DoctorQualificationDto
                {
                    Id = qualification.QualificationId,
                    Name = qualification.Name,
                    Institute = qualification.Institute,
                    AcquiredDate = qualification.AcquiredDate
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

        [Authorize("DoctorOnlyPolicy")]
        [HttpPost("me/qualifications")]
        public async Task<IActionResult> AddQualification(DoctorQualificationDto qualification)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var newQualification = await _doctorRepository.AddQualification(userIdDb, qualification);

                var formattedQualification = new
                {
                    newQualification.QualificationId,
                    newQualification.Name,
                    newQualification.Institute,
                    newQualification.AcquiredDate
                };

                return Ok(formattedQualification);
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

        [Authorize("DoctorOnlyPolicy")]
        [HttpPut("me/qualifications/{qualificationId}")]
        public async Task<IActionResult> UpdateQualification(int qualificationId, DoctorQualificationDto qualification)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _doctorRepository.UpdateQualification(userIdDb, qualificationId, qualification);

                return Ok(new { message = "Successfully Updated Qualification!" });
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

        [Authorize("DoctorOnlyPolicy")]
        [HttpDelete("me/qualifications/{qualificationId}")]
        public async Task<IActionResult> DeleteQualification(int qualificationId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _doctorRepository.DeleteQualification(userIdDb, qualificationId);

                return Ok(new { message = "Successfully Deleted Qualification!" });
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


        [HttpGet("me/specializations")]
        public async Task<IActionResult> GetSpecializations()
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var specializations = await _doctorRepository.GetMySpecializations(userIdDb);

                var formattedData = specializations.Select(specialization => new DoctorSpecializationDto
                {
                    Id = specialization.SpecialtyId,
                    Name = specialization.Name
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

        [HttpPost("me/specializations")]
        public async Task<IActionResult> AddSpecialization(DoctorSpecializationDto specialization)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                var newSpecialization = await _doctorRepository.AddSpecialization(userIdDb, specialization);

                var formattedSpecialization = new
                {
                    newSpecialization.SpecialtyId,
                    newSpecialization.Name
                };

                return Ok(formattedSpecialization);
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


        [HttpPut("me/specializations/{specializationId}")]
        public async Task<IActionResult> UpdateSpecialization(int specializationId, DoctorSpecializationDto specialization)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _doctorRepository.UpdateSpecialization(userIdDb, specializationId, specialization);

                return Ok(new { message = "Successfully Updated Specialization!" });
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


        [HttpDelete("me/specializations/{specializationId}")]
        public async Task<IActionResult> DeleteSpecialization(int specializationId)
        {
            try
            {
                var userClaims = User.Claims;
                int userIdDb = _userService.GetUserDbIdFromToken(userClaims);

                await _doctorRepository.DeleteSpecialization(userIdDb, specializationId);

                return Ok(new { message = "Successfully Deleted Specialization!" });
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
