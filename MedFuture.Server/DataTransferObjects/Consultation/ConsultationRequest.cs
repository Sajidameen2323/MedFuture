namespace MedFuture.Server.DataTransferObjects.Consultation
{
    public class ConsultationRequest
    {
        public int AppointmentId { get; set; }
        public string Summary { get; set; }
        public string AdditionalNote { get; set; }
        public List<MedicationRequest> Medications { get; set; }
    }


    public class MedicationRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Instruction { get; set; }
    }
}
