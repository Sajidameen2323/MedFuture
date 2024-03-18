using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IDoctorRepository
    {
        
        Task<DoctorM?> GetDoctorByIdAsync(int id);
        Task<IEnumerable<DoctorM>> GetAllDoctorsAsync();
        Task UpdateDoctorAsync(DoctorM doctor);
        Task DeleteDoctorAsync(int id);
    }
}
