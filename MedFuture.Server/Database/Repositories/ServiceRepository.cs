using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task AddDoctorToService(int doctorId, int serviceId)
        {
            DoctorServiceM doctorServiceM = new DoctorServiceM
            {
                DoctorID = doctorId,
                ServiceID = serviceId
            };

            _context.DoctorServices.Add(doctorServiceM);
            _context.SaveChanges();

            return Task.CompletedTask;
        }

        public async Task<IEnumerable<ServiceM>> GetAllServices()
        {
            return await _context.Set<ServiceM>()
                .Include(service => service.DoctorServices)
                .ThenInclude(ds => ds.Doctor)
                .ThenInclude(d=> d.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorDto>> GetDoctorsForService(int serviceId)
        {
            var doctorIds = await _context.DoctorServices
            .Where(ds => ds.ServiceID == serviceId)
            .Select(ds => ds.DoctorID)
            .ToListAsync();

            var doctors = await _context.Doctors
              .Where(d => doctorIds.Contains(d.DoctorID))
              .Select(d => new DoctorDto { DoctorID = d.DoctorID, FirstName = d.User.FirstName, LastName = d.User.LastName })
              .ToListAsync();


            return doctors;
        }

        public async Task<ServiceM?> GetService(int serviceId)
        {
            var service = await _context.Services.Where(s => s.ServiceID == serviceId)
                .Include(s => s.DoctorServices).FirstOrDefaultAsync();

            return service;
        }

        public Task UpdateService(ServiceDto serviceDto)
        {
            var existingService = _context.Services.FirstOrDefault(s => s.ServiceID == serviceDto.Id);

            if (existingService == null)
            {
                // Handle the case where the service with the given ID is not found
                throw new ArgumentException($"Service with ID {serviceDto.Id} not found.");
            }
            existingService.Name = serviceDto.Name;
            existingService.Description = serviceDto.Description;
            existingService.Duration = serviceDto.Duration;
            existingService.ServiceCharge = serviceDto.ServiceCharge;

            _context.SaveChanges();

            return Task.CompletedTask;
        }


        public Task RemoveDoctorFromService(int doctorId, int serviceId)
        {
            var doctorService = _context.DoctorServices
                .SingleOrDefault(ds => ds.DoctorID == doctorId && ds.ServiceID == serviceId);
            if (doctorService != null)
            {
                _context.DoctorServices.Remove(doctorService);
                _context.SaveChanges();
            }

            return Task.CompletedTask;
        }

        public async Task<ServiceM> AddService(ServiceDto serviceDto)
        {
            ServiceM serviceM = new ServiceM { Description = serviceDto.Description, Name = serviceDto.Name, Duration= serviceDto.Duration, ServiceCharge = serviceDto.ServiceCharge };
            _context.Services.Add(serviceM);
            await _context.SaveChangesAsync();

            return serviceM;

        }

        public async Task DeleteService(int serviceId)
        {
            ServiceM? service = await GetService(serviceId);
            if(service != null)
            {

                _context.Set<ServiceM>().Remove(service);
                await _context.SaveChangesAsync();
            }
        }
    }
}
