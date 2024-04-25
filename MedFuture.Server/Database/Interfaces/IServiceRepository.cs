using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.DataTransferObjects.Service;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IServiceRepository
    {
        Task<IEnumerable<ServiceM>> GetAllServices();
        Task<ServiceM> GetService(int serviceId);
        Task<IEnumerable<DoctorDto>> GetDoctorsForService(int serviceId);
        Task<ServiceM> AddService(ServiceDto serviceDto);
        Task UpdateService(ServiceDto serviceDto);
        Task AddDoctorToService(int doctorId, int serviceId);
        Task RemoveDoctorFromService(int docServiceId);
        Task DeleteService(int serviceId);
    }
}
