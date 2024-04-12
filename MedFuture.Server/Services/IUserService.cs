using MedFuture.Server.Database;
using MedFuture.Server.DataTransferObjects.Docotor;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;

namespace MedFuture.Server.Services
{
    public interface IUserService
    {
        public Task<UserM?> GetUser(string firebaseId);
        public Task<PatientM?> GetPatient(int userId);
        public Task<PatientM> CreatePatient(PatientCreateDto patientDto);
        public Task<DoctorM> CreateDoctor(DoctorCreateDto doctorDto);
        public Task<UserM> CreateUserFromGoogleAuth(PatientCreateFromGoogleAuthDto patientData);
        public Task<string> GetCustomToken(UserM user, string uid);

    }
}
