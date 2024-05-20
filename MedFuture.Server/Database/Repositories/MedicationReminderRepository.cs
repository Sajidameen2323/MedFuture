
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class MedicationReminderRepository: IMedicationReminderRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicationReminderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReminderMedication>> GetAllAsync(int userID)
        {
            var patient = _context.Patients.Where(p => p.UserID == userID)
               .Include(p => p.User)
               .Include(p => p.reminderMedications)
               .FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            return patient.reminderMedications;
        }


        public async Task<ReminderMedication> AddAsync(int userID, MedicationReminderDto medicationReminder)
        {
            var patient = _context.Patients.Where(p => p.UserID == userID).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            ReminderMedication reminder = new ReminderMedication()
            {
                PatientId = patient.PatientID,
                Name =  medicationReminder.Name,
                Dosage = medicationReminder.Dosage,
                ReminderTime = medicationReminder.ReminderTime,
                Type = medicationReminder.MedicationType,
                IsActive = medicationReminder.IsActive,
                Visible = medicationReminder.Visible,

            };

            _context.reminderMedications.Add(reminder);

            _context.SaveChanges();

            return reminder;
        }

        public async Task<ReminderMedication> UpdateAsync(int userID, int reminderId ,MedicationReminderDto medicationReminder)
        {
            var patient = _context.Patients.Where(p => p.UserID == userID).FirstOrDefault();
            var reminder = await _context.reminderMedications.Where(r => r.Id == reminderId).FirstOrDefaultAsync();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if (reminder == null)
            {
                throw new ArgumentException("Invalid Reminder ID");
            }
            if (reminder.PatientId != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            reminder.Name = medicationReminder.Name;
            reminder.Dosage = medicationReminder.Dosage;
            reminder.ReminderTime = medicationReminder.ReminderTime;
            reminder.IsActive = medicationReminder.IsActive;
            reminder.Type = medicationReminder.MedicationType;
            reminder.Visible = medicationReminder.Visible;

            await _context.SaveChangesAsync();

            return reminder;

        }

        public async Task DeleteAsync(int userID, int reminderId)
        {
            var patient = _context.Patients.Where(p => p.UserID == userID).FirstOrDefault();
            var reminder = await _context.reminderMedications.Where(r => r.Id == reminderId).FirstOrDefaultAsync();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if (reminder == null)
            {
                throw new ArgumentException("Invalid Reminder ID");
            }
            if (reminder.PatientId != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            _context.reminderMedications.Remove(reminder);

            await _context.SaveChangesAsync();
        }

    }
}
