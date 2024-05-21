using MedFuture.Server.Options;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;

namespace MedFuture.Server.WebRateLimitAuth
{
    public class SampleRateLimiterPolicy: IRateLimiterPolicy<string>
    {
        private Func<OnRejectedContext, CancellationToken, ValueTask>? _onRejected;
        private readonly MyRateLimitOptions _options;

        public SampleRateLimiterPolicy(ILogger<SampleRateLimiterPolicy> logger,
                               IOptions<MyRateLimitOptions> options)
        {
            _onRejected = (ctx, token) =>
            {
                ctx.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                logger.LogWarning($"Request rejected by {nameof(SampleRateLimiterPolicy)}");
                return ValueTask.CompletedTask;
            };
            _options = options.Value;
        }
        public Func<OnRejectedContext, CancellationToken, ValueTask>? OnRejected => _onRejected;

        public RateLimitPartition<string> GetPartition(HttpContext httpContext)
        {
            return RateLimitPartition.GetSlidingWindowLimiter(string.Empty,
                _ => new SlidingWindowRateLimiterOptions
                {
                    PermitLimit = 1,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 2,
                    Window = TimeSpan.FromHours(12),
                    SegmentsPerWindow = 1
                });
        }
    }
}
