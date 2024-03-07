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


            //model building User table
            modelBuilder.Entity<PatientM>()
                .HasIndex(p => p.UserID)
                .IsUnique();

            modelBuilder.Entity<PatientM>()
                .Property(p => p.Gender)
                .HasConversion<int>();
        }

        public DbSet<UserM> Users { get; set; }
        public DbSet<PatientM> Patients { get; set; }
    }
}
