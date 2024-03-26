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
            .HasQueryFilter(u => !u.IsDeleted);

            modelBuilder.Entity<UserM>()
                .HasData(
                    new UserM{ FirebaseID= "xDxz86iwctc9hI95uReZYzqEdmv1", Email= "slimshady0632@gmail.com", FirstName="Super", LastName="Admin",
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
                .HasQueryFilter(p => !p.User.IsDeleted);

            modelBuilder.Entity<PatientM>()
                .HasIndex(p => p.UserID)
                .IsUnique();

            modelBuilder.Entity<PatientM>()
                .Property(p => p.Gender)
                .HasConversion<int>();


            //model building Doctor table
            modelBuilder.Entity<DoctorM>()    
                .HasQueryFilter(d => !d.User.IsDeleted);

            modelBuilder.Entity<DoctorM>()
                .HasIndex(d => d.UserID)
                .IsUnique();

            modelBuilder.Entity<DoctorM>()
                .Property(p => p.Gender)
                .HasConversion<int>();

            modelBuilder.Entity<DoctorM>()
                .HasOne(d => d.User);


            //Model building for services table


            // Define foreign key relationship between DoctorService and Doctor
            //modelBuilder.Entity<DoctorServiceM>()
            //    .HasOne(ds => ds.Doctor)
            //    .WithMany(d => d.DoctorServices)
            //    .HasForeignKey(ds => ds.DoctorID)
            //    .OnDelete(DeleteBehavior.Cascade);

            //Model building for table DoctorServices
            modelBuilder.Entity<DoctorServiceM>()
               .HasKey(ds => new { ds.DoctorID, ds.ServiceID });

            // Define foreign key relationship between DoctorService and Service
            //modelBuilder.Entity<DoctorServiceM>()
            //    .HasOne(ds => ds.Service)
            //    .WithMany(s => s.DoctorServices)
            //    .HasForeignKey(ds => ds.ServiceID)
            //    .OnDelete(DeleteBehavior.Cascade);

        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Iterate through entities marked for deletion
            foreach (var entry in ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Deleted))
            {
                if (entry.Entity is ISoftDeleteBase entity)
                {
                    entity.IsDeleted = true;
                    entry.State = EntityState.Modified; // Update instead of Delete
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }


        public DbSet<UserM> Users { get; set; }
        public DbSet<PatientM> Patients { get; set; }
        public DbSet<DoctorM> Doctors { get; set; }
        public DbSet<DoctorQualificationM> DoctorQualifications { get; set;}
        public DbSet<DoctorSpecialtyM> DoctorSpecialties { get; set; }
        public DbSet<ServiceM> Services { get; set; }
        public DbSet<DoctorServiceM> DoctorServices { get; set; }
    }
}
