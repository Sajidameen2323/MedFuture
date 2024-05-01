using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateHolidayTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_appointmentSettings",
                table: "appointmentSettings");

            migrationBuilder.RenameTable(
                name: "appointmentSettings",
                newName: "AppointmentSettings");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppointmentSettings",
                table: "AppointmentSettings",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Holidays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Holidays", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Holidays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppointmentSettings",
                table: "AppointmentSettings");

            migrationBuilder.RenameTable(
                name: "AppointmentSettings",
                newName: "appointmentSettings");

            migrationBuilder.AddPrimaryKey(
                name: "PK_appointmentSettings",
                table: "appointmentSettings",
                column: "Id");
        }
    }
}
