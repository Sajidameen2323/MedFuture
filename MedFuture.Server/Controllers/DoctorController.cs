using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {

        private readonly IDoctorRepository _doctorRepository;

        public DoctorController(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
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
            IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

            return Ok(docList);
        }

        [HttpGet("doctors-for-form")]
        public async Task<IActionResult> GetAllDoctorsForForm()
        {
            IEnumerable<DoctorM> docList = await _doctorRepository.GetAllDoctorsAsync();

            var doctorDtoList = docList.Select(doctor => new { doctorID = doctor.DoctorID, name = doctor.User.FirstName + " " + doctor.User.LastName });

            return Ok(doctorDtoList);
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

    }
}
