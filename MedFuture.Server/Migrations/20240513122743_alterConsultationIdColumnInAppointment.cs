using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class alterConsultationIdColumnInAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Consultations_ConsultationId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Consultations_ConsultationId",
                table: "Appointments",
                column: "ConsultationId",
                principalTable: "Consultations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Consultations_ConsultationId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Consultations_ConsultationId",
                table: "Appointments",
                column: "ConsultationId",
                principalTable: "Consultations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
