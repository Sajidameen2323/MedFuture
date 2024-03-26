namespace MedFuture.Server.Models
{
    public interface ISoftDeleteBase
    {
        bool IsDeleted { get; set; }
    }
}
