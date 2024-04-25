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

        private readonly ILogger<ServiceController> _logger;
        private readonly IServiceRepository _serviceRepository;

        public ServiceController(ILogger<ServiceController> logger, IServiceRepository serviceRepository)
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
                              .Select(ds => new DoctorNameDto { DocServiceId = ds.DoctorServiceID ,DoctorID=ds.DoctorID ,FullName= $"{ds.Doctor.User.FirstName} {ds.Doctor.User.LastName}", FirstName = ds.Doctor.User.FirstName, LastName = ds.Doctor.User.LastName })
                              .ToList()
            }).ToList();

            return Ok(listServiceDto);

        }
        [HttpGet("get-service/{id}")]
        public async Task<IActionResult> GetService(int id)
        {
            try
            {
                ServiceM? service = await _serviceRepository.GetService(id);
               
                if(service != null)
                {
                    var obj = new { ServiceID = service.ServiceID, Description = service.Description, Name = service.Name, ServiceCharge = service.ServiceCharge, Duration = service.Duration };

                    return Ok(new { success = true, data = obj });
                }
                else
                {
                    return BadRequest(new { success = false, message = "No such service found!" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

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

        [HttpPost("update-service")]
        public async Task<IActionResult> UpdateService(ServiceDto serviceDto)
        {
            try
            {
                await _serviceRepository.UpdateService(serviceDto);

                return Ok(new { success = true, Message = "Successfully Updated Service!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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

        [HttpDelete("service-delete/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            try
            {
                await _serviceRepository.DeleteService(id);
                return Ok();

            }
            catch(Exception ex)
            {
               return BadRequest(ex.Message);
            }

        }

        [HttpDelete("remove-doctor-from-service/{id}")]
        public async Task<IActionResult> RemoveDoctorFromService(int id)
        {
            try
            {
                await _serviceRepository.RemoveDoctorFromService(id);
                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
