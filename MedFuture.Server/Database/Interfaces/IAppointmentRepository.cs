using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IAppointmentRepository
    {

        Task<IEnumerable<AppointmentM>> GetAppointmentsForNextTwoWeeks();
        Task<AppointmentM> CreateAppointment(CreateAppointmentDto createAppointmentDto);

    }
}
