using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IPatientRepository
    {
        Task<PatientM> GetPersonalData(int userId);

    }
}
