namespace MedFuture.Server.DataTransferObjects.Statistics
{
    public class RevenueStatisticsData
    {
        public List<WeeklyRevenue> Week { get; set; }
        public List<MonthlyRevenue> Month { get; set; }
        public List<YearlyRevenue> Year { get; set; }
    }

    public class WeeklyRevenue
    {
        public string Label { get; set; }
        public decimal Revenue { get; set; }
    }

    public class MonthlyRevenue
    {
        public string Label { get; set; }
        public decimal Revenue { get; set; }
    }

    public class YearlyRevenue
    {
        public string Label { get; set; }
        public decimal Revenue { get; set; }
    }
}
