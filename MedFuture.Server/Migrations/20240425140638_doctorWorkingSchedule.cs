using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class doctorWorkingSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DoctorWorkDaySchedule",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsWorkingDay = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorWorkDaySchedule", x => new { x.DoctorId, x.DayOfWeek });
                    table.ForeignKey(
                        name: "FK_DoctorWorkDaySchedule_Doctor_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctor",
                        principalColumn: "DoctorID",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorWorkDaySchedule");
        }
    }
}
