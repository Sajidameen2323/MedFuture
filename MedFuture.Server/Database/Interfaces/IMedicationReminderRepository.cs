using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IMedicationReminderRepository
    {
        Task<IEnumerable<ReminderMedication>> GetAllAsync(int userID);
        Task<ReminderMedication> AddAsync(int userID, MedicationReminderDto medicationReminder);
        Task<ReminderMedication> UpdateAsync(int userID, int reminderId, MedicationReminderDto medicationReminder);
        Task DeleteAsync(int userID, int reminderId);
    }
}
