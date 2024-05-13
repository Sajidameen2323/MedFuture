using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Consultation;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class ConsultationRepository : IConsultationRepository
    {
        private readonly ApplicationDbContext _context;

        public ConsultationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddOrUpdateConsultationAsync(int userId, ConsultationRequest consultationRequest)
        {
            var doctor = _context.Doctors.Where(d=> d.UserID == userId).FirstOrDefault();
            var appointment = _context.Appointments.Where(a=> a.AppointmentId ==  consultationRequest.AppointmentId)
                .Include(a=> a.Consultation)
                .ThenInclude(c => c.Medications)
                .FirstOrDefault();

            if (doctor == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if( appointment == null)
            {
                throw new ArgumentException("Invalid Appointment ID");
            }
            if(appointment.DoctorId != doctor.DoctorID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            ConsultationM consultation;

            if (appointment.ConsultationId.HasValue)
            {
                consultation = appointment.Consultation;

                consultation.Summary = consultationRequest.Summary;
                consultation.AdditionalNote = consultationRequest.AdditionalNote;
                consultation.Medications = consultationRequest?.Medications.Select(m => new MedicationM
                {
                    Name = m.Name,
                    Instruction = m.Instruction
                })
                .ToList() ?? [];

            }
            else
            {
                consultation = new ConsultationM
                {
                    AppointmentId = consultationRequest.AppointmentId,
                    AdditionalNote = consultationRequest.AdditionalNote,
                    Summary = consultationRequest.Summary,
                    Medications = consultationRequest?.Medications.Select(m => new MedicationM
                    {
                        Name = m.Name,
                        Instruction = m.Instruction
                    })
                    .ToList() ?? []

            };

                appointment.Consultation = consultation;
            }

            await _context.SaveChangesAsync();
  
        }


    }
}
