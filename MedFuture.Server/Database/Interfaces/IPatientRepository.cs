using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IPatientRepository
    {
        Task<PatientM> GetPersonalData(int userId);
        Task UpdateProfile(int patientId,PatientUpdateFormDto patientUpdateForm);
        Task<IEnumerable<AllergyM>> GetAllergies(int patientId);
        Task<AllergyM> AddAllergy(int patientId, AllergyDto allergy);
        Task UpdateAlelrgy( int patientId, int allergyId, AllergyDto allergy);
        Task DeleteAllergy(int patientId, int allergyId);
        Task<IEnumerable<DiagnosisM>> GetDiagnoses(int patientId);
        Task<DiagnosisM> AddDiagnosis(int patientId, DiagnosisDto diagnosis);
        Task UpdateDiagnosis(int patientId, int diagnosisId, DiagnosisDto diagnosis);
        Task DeleteDiagnosis(int patientId, int diagnosisId);


    }
}
