using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MedFuture.Server.Database
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //model building User table

            modelBuilder.Entity<UserM>()
                .HasData(
                    new UserM{ FirebaseID= "gTl85s5wAwZQPxfhIxlWqihtLWF3", Email= "admin123@gmail.com", FirstName="Super", LastName="Admin",
                    Role = UserRole.Admin, UserID = 1}
                );

            modelBuilder.Entity<UserM>()
                .Property(x => x.Role)
                .HasConversion<int>();

            modelBuilder.Entity<UserM>()
                .HasIndex(u => u.FirebaseID)
                .IsUnique();
            modelBuilder.Entity<UserM>()
                .HasIndex(u => u.Email)
                .IsUnique();


            //model building Patient table
            modelBuilder.Entity<PatientM>()
                .HasIndex(p => p.UserID)
                .IsUnique();

            modelBuilder.Entity<PatientM>()
                .Property(p => p.Gender)
                .HasConversion<int>();


            //model building Doctor table
            modelBuilder.Entity<DoctorM>()
                .HasIndex(d => d.UserID)
                .IsUnique();

            modelBuilder.Entity<DoctorM>()
                .Property(p => p.Gender)
                .HasConversion<int>();

            modelBuilder.Entity<DoctorM>()
                .HasOne(d => d.User);

        }

        public DbSet<UserM> Users { get; set; }
        public DbSet<PatientM> Patients { get; set; }
        public DbSet<DoctorM> Doctors { get; set; }
        public DbSet<DoctorQualificationM> DoctorQualifications { get; set;}
        public DbSet<DoctorSpecialtyM> DoctorSpecialties { get; set; }
    }
}
