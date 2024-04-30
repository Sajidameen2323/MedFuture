using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;

        public DoctorRepository(ApplicationDbContext context)
        {


            _context = context;
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctorToDelete = await GetDoctorByIdAsync(id);
            if (doctorToDelete != null)
            {
                Console.WriteLine("Doctor iraan kallen " + doctorToDelete.User.FirstName);

                await FirebaseAuth.DefaultInstance.DeleteUserAsync(doctorToDelete.User.FirebaseID);

                _context.Set<UserM>().Remove(doctorToDelete.User);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<DoctorM>> GetAllDoctorsAsync()
        {
            return await _context.Set<DoctorM>().Include(d => d.User).Include(d => d.WorkingHours).Include(d=> d.WorkDaySchedule).ToListAsync();
        }

        public async Task<DoctorM?> GetDoctorByIdAsync(int id)
        {
            return await _context.Set<DoctorM>().Include(d => d.User).Include(d => d.WorkingHours).FirstOrDefaultAsync(d => d.DoctorID == id);
        }

        public async Task UpdateDoctorAsync(DoctorM doctor)
        {
            _context.Entry(doctor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DoctorWorkDayScheduleM>> GetDoctorWorkDaySchedule(int id)
        {
            return _context.DoctorWorkDaySchedules
                .Where(s => s.DoctorId == id)
                .ToList();
        }


        public async Task UpdateDoctorWorkDaySchedule(DoctorWorkDayScheduleupdateDto workDayScheduleDto)
        {
            DoctorM? doc = _context.Doctors
                .Include(d => d.WorkDaySchedule)
                .Where(d => d.DoctorID == workDayScheduleDto.DoctorId)
                .FirstOrDefault();

            if (doc == null)
            {
                throw new ArgumentException("Doctor ID mismatch");
            }

            if (!workDayScheduleDto.IsValid())
            {
                throw new ArgumentException("Work day schedule must include all weekdays");
            }

            if (!workDayScheduleDto.IsTimeRangeValid())
            {
                throw new ArgumentException("Invalid WorkHours Time Range");
            }


            var doctorId = workDayScheduleDto.DoctorId;

            var existingSchedules = _context.DoctorWorkDaySchedules
                .Where(s => s.DoctorId == doctorId)
                .ToList();

            if (existingSchedules.Count == 7) { 
            
                foreach(DoctorWorkDayScheduleM doctorWorkDaySchedule in existingSchedules)
                {
                    doctorWorkDaySchedule.IsWorkingDay = workDayScheduleDto.WorkDaySchedule.GetValueOrDefault((int)((DayOfWeek)doctorWorkDaySchedule.DayOfWeek), false);

                }
                _context.SaveChanges();
            }
            else
            {
                _context.DoctorWorkDaySchedules.RemoveRange(existingSchedules);

                var newSchedules = Enumerable.Range(0, 7)
                    .Select(day => new DoctorWorkDayScheduleM
                    {
                        DoctorId = doctorId,
                        DayOfWeek = (DayOfWeek)day,
                        IsWorkingDay = workDayScheduleDto.WorkDaySchedule.GetValueOrDefault((int)((DayOfWeek)day), false)
                    });

                _context.DoctorWorkDaySchedules.AddRange(newSchedules);
                _context.SaveChanges();
            }



        }

        public async Task UpdateDoctorWorkHours(DoctorWorkDayScheduleupdateDto workDayScheduleDto)
        {

            TimeSpan startTime = TimeSpan.Parse(workDayScheduleDto.StartTime);
            TimeSpan endTime = TimeSpan.Parse(workDayScheduleDto.EndTime);

            var existingWorkHours = _context.DoctorWorkingHours
                .Where(wh => wh.DoctorId == workDayScheduleDto.DoctorId)
                .FirstOrDefault();

            var newWorkHours = new DoctorWorkingHours
            {
                DoctorId = workDayScheduleDto.DoctorId,
                StartTime = startTime,
                EndTime = endTime
            };

            if (existingWorkHours != null)
            {
                existingWorkHours.StartTime = startTime;
                existingWorkHours.EndTime = endTime;
            }
            else
            {
                _context.DoctorWorkingHours.Add(newWorkHours);

            }

            await _context.SaveChangesAsync();
        }
    }
}
