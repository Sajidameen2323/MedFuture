using MedFuture.Server.Database.Interfaces;
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
    }
}
