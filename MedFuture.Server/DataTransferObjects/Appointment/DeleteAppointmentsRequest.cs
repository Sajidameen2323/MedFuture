namespace MedFuture.Server.DataTransferObjects.Appointment
{
    public class DeleteAppointmentsRequest
    {
        public IEnumerable<int> AppointmentIdList { get; set; }

    }
}
