using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IAppointmentRepository
    {

        Task<IEnumerable<AppointmentM>> GetAppointmentsForNextSchedule(int docId);
        Task<AppointmentM> CreateAppointment(CreateAppointmentDto createAppointmentDto);
        Task<IEnumerable<AppointmentM>> GetAppointmentsForDateRange(DateTime startDate, DateTime endDate);
        Task<int> DeleteAppointmentsByIdList(IEnumerable<int> appointmentIdList);
        Task<int> BulkUpdateAppointmentStatus(IEnumerable<int> appointmentIdList, AppointmentStatus newStatus);
        Task<IEnumerable<DoctorWorkDayScheduleM>> GetNotWorkingDaysForDoctor(int docId);
        Task<AppointmentSettingsM> GetAppointmentSettings();
        Task UpdateAppointmentSettingsAsync(AppointmentSettingsM newAppointmentSettings);
    }
}
