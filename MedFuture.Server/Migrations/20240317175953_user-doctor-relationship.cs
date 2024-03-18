using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class userdoctorrelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Doctor_UserID",
                table: "Doctor");

            migrationBuilder.CreateIndex(
                name: "IX_Doctor_UserID",
                table: "Doctor",
                column: "UserID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Doctor_UserID",
                table: "Doctor");

            migrationBuilder.CreateIndex(
                name: "IX_Doctor_UserID",
                table: "Doctor",
                column: "UserID");
        }
    }
}
