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
        Task DisableDoctorAsync(int id);
        Task ActivateDoctorAsync(int id);
        Task<IEnumerable<DoctorWorkDayScheduleM>> GetDoctorWorkDaySchedule(int id);
        Task UpdateDoctorWorkDaySchedule(DoctorWorkDayScheduleupdateDto workDayScheduleDto);
        Task UpdateDoctorWorkHours(DoctorWorkDayScheduleupdateDto workDayScheduleDto);

        Task<IEnumerable<DoctorQualificationM>> GetMyQualifications(int doctorId);
        Task<DoctorQualificationM> AddQualification(int doctorId, DoctorQualificationDto qualification);
        Task UpdateQualification(int doctorId, int qualificationId, DoctorQualificationDto qualification);
        Task DeleteQualification(int doctorId, int qualificationId);

        Task<IEnumerable<DoctorSpecializationM>> GetMySpecializations(int doctorId);
        Task<DoctorSpecializationM> AddSpecialization(int doctorId, DoctorSpecializationDto specialization);
        Task UpdateSpecialization(int doctorId, int specializationId, DoctorSpecializationDto specialization);
        Task DeleteSpecialization(int doctorId, int specializationId);

    }
}
