namespace MedFuture.Server.DataTransferObjects.Statistics
{
    public class GeneralStatisticsData
    {
        public int TotalBookings { get; set; }
        public decimal TotalBookingsPercentageChange { get; set; }
        public int TotalBookingsThisYear { get; set; }

        public int TotalCompleted { get; set; }
        public decimal TotalCompletedPercentageChange { get; set; }
        public int TotalCompletedThisYear { get; set; }

        public int TotalMissed { get; set; }
        public decimal TotalMissedPercentageChange { get; set; }
        public int TotalMissedThisYear { get; set; }

        public decimal TotalRevenue { get; set; }
        public decimal TotalRevenuePercentageChange { get; set; }
        public decimal TotalRevenueThisYear { get; set; }
        public decimal WeeklyRevenue { get; set; }
        public decimal[] WeeklyRevenueByDay { get; set; }
    }
}
