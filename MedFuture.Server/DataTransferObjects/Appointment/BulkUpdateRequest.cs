namespace MedFuture.Server.DataTransferObjects.Appointment
{
    public class BulkUpdateRequest
    {
        public IEnumerable<int> AppointmentIdList { get; set; }
        public AppointmentStatus NewStatus { get; set; }

        public bool sendEmail { get; set; } = false;
    }
}
