using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.DataTransferObjects.Statistics;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MedFuture.Server.Database.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly ApplicationDbContext _context;

        public StatisticsRepository(ApplicationDbContext context)
        {

            _context = context;
        }

        public async Task<RevenueStatisticsData> GetRevenueStatisticsDataAsync()
        {

            //var weeklyRevenues = _context.Payments
            //    .Where(p => p.PaymentDate >= DateTime.Now.AddDays(-7))
            //    .GroupBy(p => EF.Functions.DateDiffDay(DateTime.Now, p.PaymentDate))
            //    .OrderBy(g => g.Key)
            //    .Select(g => new WeeklyRevenue
            //    {
            //        Label = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(DateTime.Now.AddDays(-g.Key).DayOfWeek),
            //        Revenue = g.Sum(p => p.TotalCost)
            //    })
            //    .ToList();

            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var payments = _context.Payments
                .Where(p => p.PaymentDate >= startOfWeek && p.PaymentDate < endOfWeek)
                .ToList();

            var weeklyRevenues = payments
                .GroupBy(p => p.PaymentDate.DayOfWeek)
                .OrderBy(g => g.Key)
                .Select(g => new WeeklyRevenue
                {
                    Label = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(g.Key),
                    Revenue = g.Sum(p => p.TotalCost)
                })
                .ToList();

            var monthlyRevenues = _context.Payments
                .Where(p => p.PaymentDate >= DateTime.Now.AddMonths(-12))
                .GroupBy(p => new { Month = p.PaymentDate.Month, Year = p.PaymentDate.Year })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyRevenue
                {
                    Label = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                    Revenue = g.Sum(p => p.TotalCost)
                })
                .ToList();

            var yearlyRevenues = _context.Payments
                .GroupBy(p => p.PaymentDate.Year)
                .OrderBy(g => g.Key)
                .Select(g => new YearlyRevenue
                {
                    Label = g.Key.ToString(),
                    Revenue = g.Sum(p => p.TotalCost)
                })
                .ToList();

            return new RevenueStatisticsData
            {
                Week = weeklyRevenues,
                Month = monthlyRevenues,
                Year = yearlyRevenues
            };
        }

        public async Task<GeneralStatisticsData> GetGeneralStatisticsDataAsync()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var startOfWeek = DateTime.Today.AddDays(
                (-(int)DateTime.Today.DayOfWeek) % 7);
            var endOfWeek = startOfWeek.AddDays(6);

            var weeklyRevenue = GetWeeklyRevenueByDay().Sum(r => r);

            var weeklyRevenueByDay = GetWeeklyRevenueByDay();

            var allTimeAppointments = _context.Appointments
                .Include(a => a.Payment)
                .ToList();

            var currentYearAppointments = _context.Appointments
                .Include(a => a.Payment)
                .Where(a => a.StartDateTime.Year == currentYear)
                .ToList();

            var currentMonthAppointments = _context.Appointments
                .Include(a => a.Payment)
                .Where(a => a.StartDateTime.Month == currentMonth && a.StartDateTime.Year == currentYear)
                .ToList();

            var previousMonthAppointments = _context.Appointments
                .Include(a => a.Payment)
                .Where(a => a.StartDateTime.Month == previousMonth && a.StartDateTime.Year == previousYear)
                .ToList();

            var allTimeRevenue = allTimeAppointments
                .Where(a => a.Payment != null)
                .Sum(a => a.Payment.TotalCost);

            var currentYearRevenue = currentYearAppointments
                .Where(a => a.Payment != null)
                .Sum(a => a.Payment.TotalCost);

            var currentMonthRevenue = _context.Payments
                .Where(p => p.PaymentDate.Month == currentMonth && p.PaymentDate.Year == currentYear)
                .Sum(p => p.TotalCost);

            var previousMonthRevenue = previousMonthAppointments
                .Where(a => a.Payment != null)
                .Sum(a => a.Payment.TotalCost);

            var totalBookings = allTimeAppointments.Count;
            var totalBookingsThisMonth = currentMonthAppointments.Count;
            var totalBookingsThisYear = currentYearAppointments.Count;

            var totalCompleted = allTimeAppointments.Count(a => a.Status == AppointmentStatus.Completed);
            var totalCompletedThisMonth = currentMonthAppointments.Count(a => a.Status == AppointmentStatus.Completed);
            var totalCompletedThisYear = currentYearAppointments.Count(a => a.Status == AppointmentStatus.Completed);

            var totalMissed = allTimeAppointments.Count(a => a.Status == AppointmentStatus.Missed);
            var totalMissedThisMonth = currentMonthAppointments.Count(a => a.Status == AppointmentStatus.Missed);
            var totalMissedThisYear = currentYearAppointments.Count(a => a.Status == AppointmentStatus.Missed);

            var previousMonthBookings = previousMonthAppointments.Count;
            var previousMonthCompleted = previousMonthAppointments.Count(a => a.Status == AppointmentStatus.Completed);
            var previousMonthMissed = previousMonthAppointments.Count(a => a.Status == AppointmentStatus.Missed);

            var totalBookingsPercentageChange = CalculatePercentageChange(totalBookingsThisMonth, previousMonthBookings);
            var totalCompletedPercentageChange = CalculatePercentageChange(totalCompletedThisMonth, previousMonthCompleted);
            var totalMissedPercentageChange = CalculatePercentageChange(totalMissedThisMonth, previousMonthMissed);
            var totalRevenueChange = CalculatePercentageChange(currentMonthRevenue, previousMonthRevenue);

            return new GeneralStatisticsData
            {
                TotalBookings = totalBookings,
                TotalBookingsPercentageChange = totalBookingsPercentageChange,
                TotalBookingsThisYear = totalBookingsThisYear,

                TotalCompleted = totalCompleted,
                TotalCompletedPercentageChange = totalCompletedPercentageChange,
                TotalCompletedThisYear = totalCompletedThisYear,

                TotalMissed = totalMissed,
                TotalMissedPercentageChange = totalMissedPercentageChange,
                TotalMissedThisYear = totalMissedThisYear,

                TotalRevenue = allTimeRevenue,
                TotalRevenuePercentageChange = totalRevenueChange,
                TotalRevenueThisYear = currentYearRevenue,
                WeeklyRevenue = weeklyRevenue,
                WeeklyRevenueByDay = weeklyRevenueByDay

            };
        }

        private decimal CalculatePercentageChange(int currentValue, int previousValue)
        {
            Console.WriteLine("----------------------------");
            Console.WriteLine(currentValue + " - " + previousValue);
            if (previousValue == 0)
            {
                return currentValue == 0 ? 0m : 100m;
            }

            decimal percentageChange = Math.Round((decimal)((currentValue - previousValue) / (decimal)previousValue) * 100, 2);
            return percentageChange;
        }
        private decimal CalculatePercentageChange(decimal currentValue, decimal previousValue)
        {
            Console.WriteLine("----------------------------");
            Console.WriteLine(currentValue + " - " + previousValue);
            if (previousValue == 0)
            {
                return currentValue == 0 ? 0m : 100m;
            }

            decimal percentageChange = Math.Round((decimal)((currentValue - previousValue) / (decimal)previousValue) * 100, 2);
            return percentageChange;
        }

        private decimal[] GetWeeklyRevenueByDay()
        {
            var startOfWeek = DateTime.Today.AddDays(
                (-(int)DateTime.Today.DayOfWeek) % 7);
            var endOfWeek = startOfWeek.AddDays(6);

            var weeklyRevenue = new decimal[7];

            for (int i = 0; i < 7; i++)
            {
                var currentDay = startOfWeek.AddDays(i);
                weeklyRevenue[i] = _context.Payments
                    .Where(p => p.PaymentDate.Date == currentDay.Date)
                    .Sum(p => p.TotalCost);
            }

            return weeklyRevenue;
        }

        public async Task<IEnumerable<TodaysAppsStatDto>> GetTodaysAppsStatAsync()
        {
            var today = DateTime.Today;

            return await _context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Include(a => a.Service)
                .Where(a => a.StartDateTime.Date == today)
                .Take(10)
                .OrderBy(a => a.StartDateTime)
                .Select(a => new TodaysAppsStatDto
                {
                    AppointmentId = a.AppointmentId,
                    PatientName = a.Patient.User.GetFullName(), // Assuming Patient.Name property exists
                    ServiceName = a.Service.Name, // Assuming Service.Name property exists
                    Date = a.StartDateTime.Date,
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<MonthlyAppointmentCountDto>> GetThisYearAppointmentsMonthCounts()
        {
            var currentDate = DateTime.Now;
            var startOfYear = new DateTime(currentDate.Year, 1, 1);

            return await _context.Appointments
                .Where(a => a.StartDateTime >= startOfYear && a.StartDateTime < startOfYear.AddYears(1))
                .OrderBy(m => m.AppointmentDate.Month)
                .GroupBy(a => new { Month = a.StartDateTime.Month })
                .Select(g => new MonthlyAppointmentCountDto
                {
                    Month = new DateTime(currentDate.Year, g.Key.Month, 1).ToString("yyyy-MM-dd")+"T00:00:00.000Z",
                    Count = g.Count()
                })

                .ToListAsync();


        }

        public async Task<IEnumerable<AppointmentsByAgeGroup>> GetAppointmentsByAgeGroupAsync()
        {
            var currentYear = DateTime.Now.Year;

            var appointments = await _context.Appointments
                .Where(a => a.AppointmentDate.Year == currentYear)
                .Include(a => a.Patient)
                .Select(ap => new
                {
                    Month = ap.AppointmentDate.Month,
                    Patient = ap.Patient,
                    Count = 1
                })
                .ToListAsync();

            var appointmentsByAgeGroup = Enumerable.Range(1, 12)
                .Select(m => new
                {
                    MonthNumber = m,
                    MonthShort = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m),
                    Data = appointments
                        .Where(a => a.Month == m)
                        .GroupBy(a => CalculateAgeGroup(a.Patient.DOB))
                        .ToDictionary(ag => ag.Key, ag => ag.Sum(a => a.Count), StringComparer.OrdinalIgnoreCase)

                })
                .Select(m => new AppointmentsByAgeGroup
                {
                    Month = m.MonthShort,
                    AgeGroup0To18 = m.Data.GetValueOrDefault("0-18", 0),
                    AgeGroup19To64 = m.Data.GetValueOrDefault("19-64", 0),
                    AgeGroup65Plus = m.Data.GetValueOrDefault("65+", 0)
                })
                .ToList();

            return appointmentsByAgeGroup;
        }

        private string CalculateAgeGroup(DateTime? dob)
        {
            if (!dob.HasValue)
                return "Unknown";

            var today = DateTime.Today;
            var age = today.Year - dob.Value.Year;

            if (age < 19)
                return "0-18";
            else if (age < 65)
                return "19-64";
            else
                return "65+";
        }
    }
}
