using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Patient;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;
        public PatientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PatientM> GetPersonalData(int userId)
        {
            var patient = _context.Patients.Where(p => p.UserID == userId)
                .Include(p=>p.User)
                .FirstOrDefault();

            return patient;

        }

        public async Task UpdateProfile(int patientId,PatientUpdateFormDto patientUpdateForm)
        {
            var patient = _context.Patients.Where(p=> p.UserID == patientId)
                .Include(p=>p.User)
                .FirstOrDefault();

            if (patient == null)
            {
               throw new ArgumentException("Invalid User ID");
            }
            patient.User.FirstName = patientUpdateForm.FirstName;
            patient.User.LastName = patientUpdateForm.LastName;
            patient.PhoneNumber = patientUpdateForm.PhoneNumber;
            patient.EmergencyNumber = patientUpdateForm.EmergencyNumber;
            patient.BloodGroup = patientUpdateForm.BloodGroup;
            patient.Gender = patientUpdateForm.Gender;
            patient.DOB = patientUpdateForm.DateOfBirth;

            await _context.SaveChangesAsync();

        }

        public async Task<IEnumerable<AllergyM>> GetAllergies(int patientId)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId)
                .Include(p => p.User)
                .Include(p=>p.Allergies)
                .FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            return  patient.Allergies;
        }
         
        public async Task<IEnumerable<DiagnosisM>> GetDiagnoses(int patientId)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId)
                .Include(p => p.User)
                .Include(p => p.Diagnoses)
                .FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            return patient.Diagnoses;
        }

        public async Task<AllergyM> AddAllergy(int patientId, AllergyDto allergy)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            AllergyM allergyM = new AllergyM()
            {
                Name = allergy.Name,
                Reaction = allergy.Reaction,
                PatientID = patient.PatientID
            };

            _context.Allergies.Add(allergyM);

            _context.SaveChanges();

            return allergyM;
        }

        public async Task UpdateAlelrgy(int patientId, int allergyId, AllergyDto allergy)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();
            var cur_allergy = _context.Allergies.Where(a=> a.AllergyID == allergyId).FirstOrDefault();
            
            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if(cur_allergy == null)
            {
                throw new ArgumentException("Invalid Allergy Id");
            }
            if(cur_allergy.PatientID != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            cur_allergy.Name = allergy.Name;
            cur_allergy.Reaction = allergy.Reaction;

            await _context.SaveChangesAsync();

        }

        public async Task DeleteAllergy(int patientId, int allergyId)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();
            var cur_allergy = _context.Allergies.Where(a => a.AllergyID == allergyId).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if (cur_allergy == null)
            {
                throw new ArgumentException("Invalid Allergy Id");
            }
            if (cur_allergy.PatientID != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            _context.Allergies.Remove(cur_allergy);
            await _context.SaveChangesAsync();

        }

        public async Task<DiagnosisM> AddDiagnosis(int patientId, DiagnosisDto diagnosis)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }

            DiagnosisM newDiagnosis = new DiagnosisM()
            {
                Name = diagnosis.Name,
                DiagnosisDate = diagnosis.DiagnosisDate,
                PatientID = patient.PatientID
            };

            _context.Diagnoses.Add(newDiagnosis);

            _context.SaveChanges();

            return newDiagnosis;

        }

        public async Task UpdateDiagnosis(int patientId, int diagnosisId, DiagnosisDto diagnosis)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();
            var cur_diagnosis = _context.Diagnoses.Where(d => d.DiagnosisID == diagnosisId).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if (cur_diagnosis == null)
            {
                throw new ArgumentException("Invalid Diagnosis Id");
            }
            if (cur_diagnosis.PatientID != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            cur_diagnosis.Name = diagnosis.Name;
            cur_diagnosis.DiagnosisDate = diagnosis.DiagnosisDate;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteDiagnosis(int patientId, int diagnosisId)
        {
            var patient = _context.Patients.Where(p => p.UserID == patientId).FirstOrDefault();
            var cur_diagnosis = _context.Diagnoses.Where(d => d.DiagnosisID == diagnosisId).FirstOrDefault();

            if (patient == null)
            {
                throw new ArgumentException("Invalid User ID");
            }
            if (cur_diagnosis == null)
            {
                throw new ArgumentException("Invalid Diagnosis Id");
            }
            if (cur_diagnosis.PatientID != patient.PatientID)
            {
                throw new UnauthorizedAccessException("Do not have access to the resource.");
            }

            _context.Diagnoses.Remove(cur_diagnosis);
            await _context.SaveChangesAsync();
        }
    }
}
