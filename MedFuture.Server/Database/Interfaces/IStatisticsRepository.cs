using MedFuture.Server.DataTransferObjects.Statistics;

namespace MedFuture.Server.Database.Interfaces
{
    public interface IStatisticsRepository
    {

        Task<RevenueStatisticsData> GetRevenueStatisticsDataAsync();
        Task<GeneralStatisticsData> GetGeneralStatisticsDataAsync();
        Task<IEnumerable<TodaysAppsStatDto>> GetTodaysAppsStatAsync();
        Task<IEnumerable<MonthlyAppointmentCountDto>> GetThisYearAppointmentsMonthCounts();
        Task<IEnumerable<AppointmentsByAgeGroup>> GetAppointmentsByAgeGroupAsync();
    }
}
