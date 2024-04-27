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
            var startDate = today.AddDays(3);

            // Calculate end date (today + 14 days)
            var endDate = today.AddDays(30);

            var appointments = _context.Appointments
                .Where(a => a.AppointmentDate >= startDate && a.AppointmentDate <= endDate && a.DoctorId == docId ).IgnoreQueryFilters();

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
                                       .Include(a => a.Service)
                                       .IgnoreQueryFilters();

            return appointments;
        }

        public async Task<int> DeleteAppointmentsByIdList(IEnumerable<int> appointmentIdList)
        {
            // Validate input to prevent potential SQL injection vulnerabilities
            if (appointmentIdList == null || !appointmentIdList.Any())
            {
                throw new ArgumentException("appointmentIdList cannot be null or empty.");
            }

            // Efficiently filter appointments by ID list using `Where` and `ToList` (or `ToArray`)
            var appointmentsToDelete = await _context.Appointments
                .Where(a => appointmentIdList.Contains(a.AppointmentId))
                .ToListAsync(); // Consider using ToArray if large datasets are expected

            // Remove tracked entities (optional, but recommended for large deletions)
            _context.RemoveRange(appointmentsToDelete);

            // Execute the deletion in a single database operation for efficiency
            return await _context.SaveChangesAsync();
        }


        public async Task<int> BulkUpdateAppointmentStatus(IEnumerable<int> appointmentIdList, AppointmentStatus newStatus)
        {
            // Validate input
            if (appointmentIdList == null || !appointmentIdList.Any())
            {
                throw new ArgumentException("appointmentIdList cannot be null or empty.");
            }

            // Efficiently filter appointments by ID list using `Where`
            var appointmentsToUpdate = await _context.Appointments
                .Where(a => appointmentIdList.Contains(a.AppointmentId))
                .ToListAsync(); // Consider using ToArray if large datasets are expected

            // Update status for all appointments in the list
            foreach (var appointment in appointmentsToUpdate)
            {
                appointment.Status = newStatus;
            }

            // Save changes in a single database operation for efficiency
            return await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DoctorWorkDayScheduleM>> GetNotWorkingDaysForDoctor(int docId)
        {
            var workingSchedule = _context.DoctorWorkDaySchedules.Where(ws => ws.DoctorId == docId && !ws.IsWorkingDay);

            return workingSchedule;

        }

    }
}
