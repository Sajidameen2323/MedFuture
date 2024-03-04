using MedFuture.Server.Database;
using MedFuture.Server.DataTransferObjects;
using MedFuture.Server.Models;

namespace MedFuture.Server.Services
{
    public interface IUserService
    {

        public Task<PatientM> CreatePatient(PatientCreateDto patientDto);

    }
}
