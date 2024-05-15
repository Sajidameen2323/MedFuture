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
        Task<IEnumerable<HolidayM>> GetUpcomingHolidays();
        Task AddHoliday(HolidayDto holiday);
        Task RemoveHoliday(int id);
        Task<IEnumerable<AppointmentM>> GetTodaysAppointmentsForDoctor(int userId);
        Task<AppointmentM> GetAppointmentDetailsForDoctor(int appId, int userId);
        Task UpdateAppointmentStatusForDoctor(int appId, int userId, AppointmentStatus newStatus);

        Task<IEnumerable<AppointmentM>> GetAppointmentsForPatient(int userId, DateTime startDate, DateTime endDate);
        Task<AppointmentM> GetAppointmentDetailsForPatient(int appId, int userId);
        Task UpdateAppointmentStatusForPatient(int appId, int userId, AppointmentStatus newStatus);

    }
}
