using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentSettingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "appointmentSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MinimumTimeBeforeBookingInDays = table.Column<int>(type: "int", nullable: false),
                    MinimumTimeBeforeCancelingInDays = table.Column<int>(type: "int", nullable: false),
                    MinimumTimeBeforeReschedulingInDays = table.Column<int>(type: "int", nullable: false),
                    BookingPeriodInDays = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointmentSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "appointmentSettings",
                columns: new[] { "Id", "BookingPeriodInDays", "MinimumTimeBeforeBookingInDays", "MinimumTimeBeforeCancelingInDays", "MinimumTimeBeforeReschedulingInDays" },
                values: new object[] { 1, 30, 3, 3, 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointmentSettings");
        }
    }
}
