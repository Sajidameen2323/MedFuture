using FirebaseAdmin.Messaging;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Models;
using MedFuture.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace MedFuture.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IServiceRepository _serviceRepository;

        public ServiceController(ILogger<WeatherForecastController> logger, IServiceRepository serviceRepository)
        {
            _logger = logger;
            _serviceRepository = serviceRepository;
        }

        [HttpGet("get-services")]
        public async Task<IActionResult> GetServices()
        {
            var services = await _serviceRepository.GetAllServices();

            var listServiceDto = services.Select(service => new ListServiceDto
            {
                ServiceID = service.ServiceID,
                Name = service.Name,
                Description = service.Description,
                Duration = service.Duration,
                ServiceCharge = service.ServiceCharge,
                DoctorNames = service.DoctorServices
                              .Select(ds => new DoctorNameDto { FullName= $"{ds.Doctor.User.FirstName} {ds.Doctor.User.LastName}", FirstName = ds.Doctor.User.FirstName, LastName = ds.Doctor.User.LastName })
                              .ToList()
            }).ToList();

            return Ok(listServiceDto);

        }
        [HttpPost("add-service")]
        public async Task<IActionResult> AddService(ServiceDto serviceDto)
        {
            try
            {
                var obj = await _serviceRepository.AddService(serviceDto);

                return Ok(new { success = true, data = obj, Message = "Successfully Added Service!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }
        [HttpPost("add-doctor-to-service")]
        public async Task<IActionResult> AddDoctorToService(AddDoctorToServiceDto addDoctorToService)
        {
            try
            {
                await _serviceRepository.AddDoctorToService(addDoctorToService.DoctorId, addDoctorToService.ServiceId);

                return Ok(new { success = true, Message = "Successfully Added Service To Doctor!" });
            }
            catch(DbUpdateException ex)
            {
                return BadRequest(new { success=false, Message="Service is already added to the doctor" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }
    }
}
