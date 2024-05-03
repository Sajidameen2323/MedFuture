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

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {

        private readonly IDoctorRepository _doctorRepository;
        private readonly IAppointmentRepository _appointmentRepository;

        public DoctorController(IDoctorRepository doctorRepository, IAppointmentRepository appointmentRepository)
        {
            _doctorRepository = doctorRepository;
            _appointmentRepository = appointmentRepository;
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
                    new { Name = "John", Age = 30, userId },
        
      
                };

                foreach (var item in apps)
                {
                    unknownObjects.Add(
                        new 
                        { 
                            item.AppointmentDate,
                            item.Patient.DOB,
                            item.Service.Duration,
                            item.Service.Name,
                            item.Status,
                            item.StartDateTime
                        }
                         );
                }
                return Ok(unknownObjects);

            }
            else
            {
                return Unauthorized();
            }

        }


    }

}
