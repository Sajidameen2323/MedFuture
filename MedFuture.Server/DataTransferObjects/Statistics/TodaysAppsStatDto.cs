namespace MedFuture.Server.DataTransferObjects.Statistics
{
    public class TodaysAppsStatDto
    {
        public int AppointmentId { get; set; }
        public string PatientName { get; set; }
        public string ServiceName { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}
