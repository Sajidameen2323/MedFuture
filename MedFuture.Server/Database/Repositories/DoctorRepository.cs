using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.DataTransferObjects.Patient;
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

        public async Task<DoctorM> GetPersonalData(int userIdDb)
        {
            var doctor = _context.Doctors
                .Where(d=>d.UserID == userIdDb)
                .Include(d=>d.User)
                .FirstOrDefault();

            if(doctor == null)
            {
                throw new ArgumentException("Invalid Session");
            }

            return doctor;
        }

        public async Task UpdateProfile(int patientId, DoctorUpdateFormDto doctorUpdateForm)
        {
            var doctor = _context.Doctors.Where(p => p.UserID == patientId)
                .Include(p => p.User)
                .FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            doctor.User.FirstName = doctorUpdateForm.FirstName;
            doctor.User.LastName = doctorUpdateForm.LastName;
            doctor.PhoneNumber = doctorUpdateForm.PhoneNumber;
            doctor.Gender = doctorUpdateForm.Gender;
            doctor.DOB = doctorUpdateForm.DateOfBirth;

            await _context.SaveChangesAsync();

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
            else
            {
                throw new ArgumentException("Invalid Doctor ID");

            }
        }


        public async Task DisableDoctorAsync(int id)
        {
            var doctorToDisable = await GetDoctorByIdAsync(id);
            if (doctorToDisable != null)
            {
                Console.WriteLine("Doctor iraan kallen " + doctorToDisable.User.FirstName);

                //await FirebaseAuth.DefaultInstance.DeleteUserAsync(doctorToDelete.User.FirebaseID);

                UserRecordArgs args = new UserRecordArgs()
                {
                    Uid = doctorToDisable.User.FirebaseID,
                    Disabled = true,
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.UpdateUserAsync(args);
                // See the UserRecord reference doc for the contents of userRecord.
                Console.WriteLine($"Successfully updated user: {userRecord.Uid}");

                _context.Set<UserM>().Remove(doctorToDisable.User);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("Invalid Doctor ID");

            }
        }

        public async Task ActivateDoctorAsync(int id)
        {
            var doctorToActivate = await GetDoctorByIdAsync(id);
            if (doctorToActivate != null)
            {
                Console.WriteLine("---- Doctor iraan kallen " + doctorToActivate.User.FirstName);

                //await FirebaseAuth.DefaultInstance.DeleteUserAsync(doctorToDelete.User.FirebaseID);

                UserRecordArgs args = new UserRecordArgs()
                {
                    Uid = doctorToActivate.User.FirebaseID,
                    Disabled = false,
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.UpdateUserAsync(args);
                // See the UserRecord reference doc for the contents of userRecord.
                Console.WriteLine($"Successfully updated user: {userRecord.Uid}");

                doctorToActivate.User.IsDeleted = false;

                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("Invalid Doctor ID");

            }
        }

        public async Task<IEnumerable<DoctorM>> GetAllDoctorsAsync()
        {
            return await _context.Set<DoctorM>().Include(d => d.User)
                .Include(d => d.WorkingHours)
                .Include(d=> d.WorkDaySchedule)
                .Include(d=> d.Qualifications)
                .Include(d=> d.Specializations)
                .IgnoreQueryFilters()
                .ToListAsync();
        }

        public async Task<DoctorM?> GetDoctorByIdAsync(int id)
        {
            return await _context.Set<DoctorM>().Include(d => d.User).Include(d => d.WorkingHours).IgnoreQueryFilters().FirstOrDefaultAsync(d => d.DoctorID == id);
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


        public async Task<IEnumerable<DoctorQualificationM>> GetMyQualifications(int doctorId)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId)
                .Include(d=> d.Qualifications)
                .FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            return doctor.Qualifications;
        }

        public async Task<DoctorQualificationM> AddQualification(int doctorId, DoctorQualificationDto qualification)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            DoctorQualificationM qualificationM = new DoctorQualificationM()
            {
                Name = qualification.Name,
                Institute = qualification.Institute,
                AcquiredDate = qualification.AcquiredDate,
                DoctorID = doctor.DoctorID
            };

            _context.DoctorQualifications.Add(qualificationM);
            await _context.SaveChangesAsync();

            return qualificationM;
        }

        public async Task UpdateQualification(int doctorId, int qualificationId, DoctorQualificationDto qualification)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();
            var curQualification = _context.DoctorQualifications.Where(q => q.QualificationId == qualificationId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            if (curQualification == null)
            {
                throw new ArgumentException("Invalid Qualification ID");
            }

            if (curQualification.DoctorID != doctor.DoctorID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            curQualification.Name = qualification.Name;
            curQualification.Institute = qualification.Institute;
            curQualification.AcquiredDate = qualification.AcquiredDate;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteQualification(int doctorId, int qualificationId)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();
            var curQualification = _context.DoctorQualifications.Where(q => q.QualificationId == qualificationId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            if (curQualification == null)
            {
                throw new ArgumentException("Invalid Qualification ID");
            }

            if (curQualification.DoctorID != doctor.DoctorID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            _context.DoctorQualifications.Remove(curQualification);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<DoctorSpecializationM>> GetMySpecializations(int doctorId)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId)
                .Include(d => d.Specializations)
                .FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            return doctor.Specializations;
        }

        public async Task<DoctorSpecializationM> AddSpecialization(int doctorId, DoctorSpecializationDto specialization)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            DoctorSpecializationM specializationM = new DoctorSpecializationM()
            {
                Name = specialization.Name,
                DoctorID = doctor.DoctorID
            };

            _context.DoctorSpecializations.Add(specializationM);
            await _context.SaveChangesAsync();

            return specializationM;
        }

        public async Task UpdateSpecialization(int doctorId, int specializationId, DoctorSpecializationDto specialization)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();
            var curSpecialization = _context.DoctorSpecializations.Where(s => s.SpecialtyId == specializationId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            if (curSpecialization == null)
            {
                throw new ArgumentException("Invalid Specialization ID");
            }

            if (curSpecialization.DoctorID != doctor.DoctorID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            curSpecialization.Name = specialization.Name;
            await _context.SaveChangesAsync();
        }


        public async Task DeleteSpecialization(int doctorId, int specializationId)
        {
            var doctor = _context.Doctors.Where(d => d.User.UserID == doctorId).FirstOrDefault();
            var curSpecialization = _context.DoctorSpecializations.Where(s => s.SpecialtyId == specializationId).FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid Doctor ID");
            }

            if (curSpecialization == null)
            {
                throw new ArgumentException("Invalid Specialization ID");
            }

            if (curSpecialization.DoctorID != doctor.DoctorID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            _context.DoctorSpecializations.Remove(curSpecialization);
            await _context.SaveChangesAsync();
        }


    }
}
