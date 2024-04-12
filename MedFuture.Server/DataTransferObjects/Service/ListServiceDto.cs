using MedFuture.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace MedFuture.Server.DataTransferObjects.Service
{
    public class ListServiceDto
    {

        public int ServiceID { get; set; }

        public string Name { get; set; }


        public string Description { get; set; } = string.Empty;


        public int Duration { get; set; } = 15;


        public decimal ServiceCharge { get; set; } = 0;

        public List<DoctorNameDto> DoctorNames { get; set; }

    }

    public class DoctorNameDto
    {
        public int DoctorID { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
