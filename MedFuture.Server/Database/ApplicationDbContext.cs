using MedFuture.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

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


            modelBuilder.Entity<PatientM>()
                .HasMany(p => p.Allergies)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientID)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<PatientM>()
                .Property(p => p.BloodGroup)
                .HasDefaultValue(null);


            modelBuilder.Entity<PatientM>()
                .Property(p => p.BloodGroup)
                .HasConversion<int>();

            modelBuilder.Entity<PatientM>()
                .HasMany(p => p.Diagnoses)
                .WithOne(d => d.Patient)
                .HasForeignKey(d => d.PatientID)
                .OnDelete(DeleteBehavior.Cascade);

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

            modelBuilder.Entity<DoctorM>()
                            .HasMany(d => d.WorkDaySchedule)
                            .WithOne(s => s.Doctor)
                            .HasForeignKey(s => s.DoctorId)
                            .OnDelete(DeleteBehavior.Cascade);

            //Model building for doctorWorkingSchedule table

            modelBuilder.Entity<DoctorWorkDayScheduleM>()
                .HasKey(ws => new {ws.DoctorId, ws.DayOfWeek});

            modelBuilder.Entity<DoctorWorkDayScheduleM>()
                .Property(s => s.IsWorkingDay)
                .HasDefaultValue(true);

            modelBuilder.Entity<DoctorWorkingHours>()
                 .HasOne(wh => wh.Doctor)
                 .WithOne(d => d.WorkingHours)
                 .HasForeignKey<DoctorWorkingHours>(wh => wh.DoctorId)
                 .OnDelete(DeleteBehavior.Cascade)
                 .IsRequired();

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

            //model building for appointment table

            modelBuilder.Entity<AppointmentM>()
                .HasKey(a => new { a.StartDateTime, a.EndDateTime });

            modelBuilder.Entity<AppointmentM>()
                .HasOne<ServiceM>(a => a.Service);
               
            modelBuilder.Entity<AppointmentM>()
                .Property(a=> a.Status)
                .HasConversion<int>();
            modelBuilder.Entity<AppointmentM>()
                .HasOne<PatientM>(a=> a.Patient);

            modelBuilder.Entity<AppointmentM>()
                .HasOne<DoctorM>(a => a.Doctor);

            modelBuilder.Entity<AppointmentSettingsM>()
                .HasData(new AppointmentSettingsM {
                    Id = 1,
                    MinimumTimeBeforeBookingInDays = 3,
                    MinimumTimeBeforeCancelingInDays = 3,
                    MinimumTimeBeforeReschedulingInDays = 3,
                    BookingPeriodInDays = 30
                
                });

            modelBuilder.Entity<AppointmentM>()
                .HasOne(a => a.Consultation)
                .WithOne(c => c.Appointment)
                .HasForeignKey<AppointmentM>(a => a.ConsultationId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ConsultationM>()
                .HasMany(c => c.Medications)
                .WithOne(m => m.Consultation)
                .HasForeignKey(m => m.ConsultationId)
                .OnDelete(DeleteBehavior.Cascade);

        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            var newDoctors = ChangeTracker.Entries<DoctorM>()
                .Where(e => e.State == EntityState.Added);

            foreach (var doctorEntry in newDoctors)
            {
                var doctor = doctorEntry.Entity;
                doctor.WorkDaySchedule = Enumerable.Range(0, 7)
                    .Select(i => new DoctorWorkDayScheduleM
                    {
                        DoctorId = doctor.DoctorID,
                        DayOfWeek = (DayOfWeek)i,
                        IsWorkingDay = true // Adjust as needed
                    })
                    .ToList();

                doctor.WorkingHours = new DoctorWorkingHours { DoctorId = doctor.DoctorID, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(17, 0, 0) };
            }

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
        public DbSet<AllergyM> Allergies { get; set; }
        public DbSet<DiagnosisM> Diagnoses { get; set; }

        public DbSet<DoctorM> Doctors { get; set; }
        public DbSet<DoctorWorkDayScheduleM> DoctorWorkDaySchedules { get; set; }
        public DbSet<DoctorWorkingHours> DoctorWorkingHours { get; set; }

        public DbSet<DoctorQualificationM> DoctorQualifications { get; set;}
        public DbSet<DoctorSpecialtyM> DoctorSpecialties { get; set; }
        public DbSet<ServiceM> Services { get; set; }
        public DbSet<DoctorServiceM> DoctorServices { get; set; }

        public DbSet<AppointmentM> Appointments { get; set; }
        public DbSet<AppointmentSettingsM> AppointmentSettings { get; set; }
        public DbSet<HolidayM> Holidays { get; set; }

        public DbSet<ConsultationM> Consultations { get; set; }
        public DbSet<MedicationM> Medications { get; set; }
    }
}
