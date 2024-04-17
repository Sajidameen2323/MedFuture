using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IAppointmentRepository
    {

        Task<IEnumerable<AppointmentM>> GetAppointmentsForNextTwoWeeks(int docId);
        Task<AppointmentM> CreateAppointment(CreateAppointmentDto createAppointmentDto);
        Task<IEnumerable<AppointmentM>> GetAppointmentsForDateRange(DateTime startDate, DateTime endDate);

    }
}
