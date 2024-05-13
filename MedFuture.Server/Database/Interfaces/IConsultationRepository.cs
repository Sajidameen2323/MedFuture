using MedFuture.Server.DataTransferObjects.Consultation;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IConsultationRepository
    {

        Task AddOrUpdateConsultationAsync(int userId, ConsultationRequest consultationRequest);
    }
}
