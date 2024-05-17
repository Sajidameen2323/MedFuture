using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class addPaymentTableFIx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentM_Appointments_AppointmentId",
                table: "PaymentM");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentM",
                table: "PaymentM");

            migrationBuilder.RenameTable(
                name: "PaymentM",
                newName: "Payments");

            migrationBuilder.RenameIndex(
                name: "IX_PaymentM_AppointmentId",
                table: "Payments",
                newName: "IX_Payments_AppointmentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payments",
                table: "Payments",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payments",
                table: "Payments");

            migrationBuilder.RenameTable(
                name: "Payments",
                newName: "PaymentM");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_AppointmentId",
                table: "PaymentM",
                newName: "IX_PaymentM_AppointmentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentM",
                table: "PaymentM",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentM_Appointments_AppointmentId",
                table: "PaymentM",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
