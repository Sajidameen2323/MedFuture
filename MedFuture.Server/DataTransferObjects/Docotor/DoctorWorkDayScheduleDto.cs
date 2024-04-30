namespace MedFuture.Server.DataTransferObjects.Docotor
{
    public class DoctorWorkDayScheduleupdateDto
    {
        public int DoctorId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public Dictionary<int, bool> WorkDaySchedule { get; set; }

        public DoctorWorkDayScheduleupdateDto()
        {
            WorkDaySchedule = new Dictionary<int, bool>();
        }

        public bool IsValid()
        {
            var validDays = new HashSet<int> { 0, 1, 2, 3, 4, 5, 6 };
            return WorkDaySchedule.Keys.All(validDays.Contains);
        }

        public bool IsTimeRangeValid()
        {

            TimeSpan startTimeObj;
            TimeSpan endTimeObj;

            bool isStartTimeValidTime = TimeSpan.TryParse(StartTime, out startTimeObj);
            bool isEndTimeValidTime = TimeSpan.TryParse(EndTime, out endTimeObj);

            return isStartTimeValidTime && isEndTimeValidTime;

        }
    }
}
