using System.Threading.RateLimiting;

namespace MedFuture.Server.Options
{
    public class MyRateLimitOptions
    {
        public int PermitLimit { get; set; }
        public int QueueLimit { get; set; }
        public int Window { get; set; }
        public int SegmentsPerWindow { get; set; }
    }
}
