using MedFuture.Server.Models;

namespace MedFuture.Server.DataTransferObjects.Patient
{
    public class MedicationReminderDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Dosage { get; set; }
        public TimeSpan ReminderTime { get; set; }
        public MedicationType MedicationType { get; set; }
        public bool IsActive { get; set; }
        public bool Visible { get; set; }
    }
}
