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
using MedFuture.Server.Services;
using MedFuture.Server.DataTransferObjects.Patient;

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
                        d.WorkingHours.StartTime,
                        d.WorkingHours.EndTime

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
        [HttpDelete("doctors/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            try
            {
                await _doctorRepository.DeleteDoctorAsync(id);

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong!");
            }
        }

        [Authorize("AdminOnlyPolicy")]
        [HttpGet("doctors/workdayschedule")]
        public async Task<IActionResult> GetDoctorWorkDaySchedule()
        {

            IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

            var formatted = docList.Select(d =>
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
                            allergies = app.Patient.Allergies.Select(a=> new AllergyDto
                            {
                                Id = a.AllergyID,
                                Name = a.Name,
                                Reaction = a.Reaction,

                            }) ?? [],
                            diagnoses = app.Patient.Diagnoses.Select(d=> new DiagnosisDto
                            {
                                Id = d.DiagnosisID,
                                Name = d.Name,
                                DiagnosisDate = d.DiagnosisDate,
                            }) ?? []

                        },
                        app.Service.Name,
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
    }

}
