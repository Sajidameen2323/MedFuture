using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AppointmentM>> GetAppointmentsForNextTwoWeeks(int docId)
        {

            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.Now);

            // Calculate start date (today + 7 days)
            var startDate = today.AddDays(7);

            // Calculate end date (today + 14 days)
            var endDate = today.AddDays(28);

            var appointments = _context.Appointments
                .Where(a => a.AppointmentDate >= startDate && a.AppointmentDate <= endDate && a.DoctorId == docId );

            return appointments;
        }

        public async Task<AppointmentM> CreateAppointment(CreateAppointmentDto createAppointmentDto)
        {
            AppointmentM appointment = new AppointmentM()
            {
                AppointmentDate = DateOnly.FromDateTime(createAppointmentDto.AppointmentDate),
                DoctorId = createAppointmentDto.DoctorId,
                EndDateTime = createAppointmentDto.EndDateTime,
                StartDateTime = createAppointmentDto.StartDateTime,
                PatientId = createAppointmentDto.PatientId,
                ServiceId = createAppointmentDto.ServiceId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment;
        }

        public async Task<IEnumerable<AppointmentM>> GetAppointmentsForDateRange(DateTime startDate, DateTime endDate)
        {
            var appointments = _context.Appointments.Where(a => a.AppointmentDate >= DateOnly.FromDateTime(startDate) && a.AppointmentDate <= DateOnly.FromDateTime(endDate))
                                       .Include(a => a.Doctor.User)
                                       .Include(a => a.Patient.User)
                                       .Include(a => a.Service);

            return appointments;
        }
    }
}
