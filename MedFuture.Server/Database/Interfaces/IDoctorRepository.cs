using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IDoctorRepository
    {
        
        Task<DoctorM?> GetDoctorByIdAsync(int id);
        Task<IEnumerable<DoctorM>> GetAllDoctorsAsync();
        Task UpdateDoctorAsync(DoctorM doctor);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<DoctorWorkDayScheduleM>> GetDoctorWorkDaySchedule(int id);
        Task UpdateDoctorWorkDaySchedule(DoctorWorkDayScheduleupdateDto workDayScheduleDto);
        Task UpdateDoctorWorkHours(DoctorWorkDayScheduleupdateDto workDayScheduleDto);
    }
}
