namespace MedFuture.Server.DataTransferObjects.Statistics
{
    public class AppointmentsByAgeGroup
    {
        public string Month { get; set; }
        public int AgeGroup0To18 { get; set; }
        public int AgeGroup19To64 { get; set; }
        public int AgeGroup65Plus { get; set; }
    }
}
