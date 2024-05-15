using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentUniqueKey3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_StartDateTime_EndDateTime_Status_DoctorId",
                table: "Appointments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_StartDateTime_EndDateTime_Status_DoctorId",
                table: "Appointments",
                columns: new[] { "StartDateTime", "EndDateTime", "Status", "DoctorId" },
                unique: true);
        }
    }
}
