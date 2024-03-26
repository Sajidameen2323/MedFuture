using FirebaseAdmin.Auth;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;

        public DoctorRepository(ApplicationDbContext context)
        {


            _context = context;
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctorToDelete = await GetDoctorByIdAsync(id);
            if (doctorToDelete != null)
            {
                Console.WriteLine("Doctor iraan kallen " + doctorToDelete.User.FirstName);

                await FirebaseAuth.DefaultInstance.DeleteUserAsync(doctorToDelete.User.FirebaseID);

                _context.Set<UserM>().Remove(doctorToDelete.User);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<DoctorM>> GetAllDoctorsAsync()
        {
            return await _context.Set<DoctorM>().Include(d => d.User).ToListAsync();
        }

        public async Task<DoctorM?> GetDoctorByIdAsync(int id)
        {
            return await _context.Set<DoctorM>().Include(d => d.User).FirstOrDefaultAsync(d => d.DoctorID == id);
        }

        public async Task UpdateDoctorAsync(DoctorM doctor)
        {
            _context.Entry(doctor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
