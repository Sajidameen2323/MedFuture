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

            var today = DateTime.Today.DayOfWeek;
            var startOfWeek = today - (int)today;

            var payments = _context.Payments
                .Where(p => p.PaymentDate >= DateTime.Now.AddDays(-7))
                .ToList();

            var weeklyRevenues = payments
                .GroupBy(p => (p.PaymentDate.DayOfWeek - startOfWeek + 7) % 7)
                .OrderBy(g => g.Key)
                .Select(g => new WeeklyRevenue
                {
                    Label = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName((DayOfWeek)g.Key),
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

            var currentMonthRevenue = currentMonthAppointments
                .Where(a => a.Payment != null)
                .Sum(a => a.Payment.TotalCost);

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

                TotalRevenue = currentMonthRevenue,
                TotalRevenuePercentageChange = totalRevenueChange,
                TotalRevenueThisYear = allTimeRevenue
            };
        }

        private decimal CalculatePercentageChange(int currentValue, int previousValue)
        {
            if (previousValue == 0)
            {
                return currentValue == 0 ? 0 : 100;
            }

            return (decimal)(currentValue - previousValue) / previousValue * 100;
        }
        private decimal CalculatePercentageChange(decimal currentValue, decimal previousValue)
        {
            if (previousValue == 0)
            {
                return currentValue == 0 ? 0 : 100;
            }

            return (decimal)(currentValue - previousValue) / previousValue * 100;
        }
    }
}
