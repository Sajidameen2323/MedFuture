using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Appointment;
using MedFuture.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
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

        public async Task<IEnumerable<AppointmentM>> GetAppointmentsForNextSchedule(int docId)
        {

            AppointmentSettingsM? appointmentSettings = await _context.AppointmentSettings.SingleOrDefaultAsync();
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.Now);

            int minDaysBeforeBooking = appointmentSettings?.MinimumTimeBeforeBookingInDays ?? 3;
            int maxDaysForBooking = appointmentSettings?.BookingPeriodInDays ?? 30;

            Console.WriteLine("Appointment min and max days - " + minDaysBeforeBooking + " , " + maxDaysForBooking);

            // Calculate start date (today + 7 days)
            var startDate = today.AddDays(minDaysBeforeBooking);

            // Calculate end date (today + 14 days)
            var endDate = today.AddDays(maxDaysForBooking);

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

        public async Task<AppointmentSettingsM> GetAppointmentSettings()
        {
            AppointmentSettingsM? appointmentSettings = await _context.AppointmentSettings.SingleOrDefaultAsync();

            if (appointmentSettings == null)
            {
                appointmentSettings = new AppointmentSettingsM() { 
                    Id=0, BookingPeriodInDays = 30, MinimumTimeBeforeBookingInDays= 3,
                MinimumTimeBeforeCancelingInDays = 3,
                MinimumTimeBeforeReschedulingInDays = 3
                };
            }

            return appointmentSettings;
        }

        public async Task UpdateAppointmentSettingsAsync(AppointmentSettingsM newAppointmentSettings)
        {
            var existingSettings = await _context.AppointmentSettings.SingleOrDefaultAsync();

            if (existingSettings == null)
            {
                _context.AppointmentSettings.Add(newAppointmentSettings);
            }
            else
            {
                existingSettings.MinimumTimeBeforeBookingInDays = newAppointmentSettings.MinimumTimeBeforeBookingInDays;
                existingSettings.MinimumTimeBeforeCancelingInDays = newAppointmentSettings.MinimumTimeBeforeCancelingInDays;
                existingSettings.MinimumTimeBeforeReschedulingInDays = newAppointmentSettings.MinimumTimeBeforeReschedulingInDays;
                existingSettings.BookingPeriodInDays = newAppointmentSettings.BookingPeriodInDays;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<HolidayM>> GetUpcomingHolidays()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var holidays = await _context.Holidays.Where(h => (h.StartDate <= today && h.EndDate>= today ) || (h.StartDate>= today && h.EndDate > today) )
                .ToListAsync();

            return holidays;
        }

        public async Task AddHoliday(HolidayDto holiday)
        {

            HolidayM newHoliday = new HolidayM()
            {
                StartDate = DateOnly.FromDateTime(holiday.StartDate),
                EndDate = DateOnly.FromDateTime(holiday.EndDate),
                Name = holiday.Name
            };

            _context.Holidays.Add(newHoliday);

            await _context.SaveChangesAsync();
        }

        public async Task RemoveHoliday(int id)
        {
            var holiday = _context.Holidays.Where(h=> h.Id == id).FirstOrDefault();

            if (holiday == null) {

                throw new ArgumentException("Invalid Holiday Id");
            }
            
            _context.Holidays.Remove(holiday); 
            
            await _context.SaveChangesAsync();

        }

        public async Task<IEnumerable<AppointmentM>> GetTodaysAppointmentsForDoctor(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var doc = _context.Doctors.Where(d=> d.UserID == userId).FirstOrDefault();

            if(doc == null)
            {
                throw new ArgumentException("Invalid User Id");
            }

            Console.WriteLine("Doc Id - " + doc.DoctorID);
            Console.WriteLine("Date - "+ today);

            var appointments = _context.Appointments.Where(a=> a.DoctorId == doc.DoctorID && a.AppointmentDate == today && a.Status != AppointmentStatus.Cancelled)
                .Include(a=> a.Service)
                .Include(a=> a.Doctor)
                .Include(a=> a.Patient)
                .Include(a=> a.Patient.User)
                .ToList();    

            return appointments;
        }


        public async Task<AppointmentM> GetAppointmentDetailsForDoctor(int appId, int userId)
        {
   
            var doc = _context.Doctors.Where(d => d.UserID == userId).FirstOrDefault();

            if (doc == null)
            {
                throw new ArgumentException("Invalid User Id");
            }

            var appointment = _context.Appointments.Where(a => a.AppointmentId == appId)
                                .Include(a => a.Service)
                                .Include(a => a.Doctor)
                                .Include(a => a.Patient)
                                .Include(a => a.Patient.User)
                                .Include(a => a.Patient.Allergies)
                                .Include(a => a.Patient.Diagnoses)
                                .FirstOrDefault();

            if(appointment == null)
            {
                throw new ArgumentException("Invalid Appointment Id");
            }

            if(appointment.DoctorId != doc.DoctorID)
            {
                throw new UnauthorizedAccessException("Access to the resource is unauthorized.");

            }

            return appointment;

        }

        public async Task UpdateAppointmentStatusForDoctor(int appId, int userId, AppointmentStatus newStatus)
        {
            var doc = _context.Doctors.Where(d => d.UserID == userId).FirstOrDefault();

            if (doc == null)
            {
                throw new ArgumentException("Invalid User Id");
            }

            var appointment = _context.Appointments.Where(a => a.AppointmentId == appId).FirstOrDefault();
            if (appointment == null)
            {
                throw new ArgumentException("Invalid Appointment Id");
            }

            if (appointment.DoctorId != doc.DoctorID)
            {
                throw new UnauthorizedAccessException("Access to the resource is unauthorized.");

            }

            appointment.Status = newStatus;

            await _context.SaveChangesAsync();
        }
    }
}
