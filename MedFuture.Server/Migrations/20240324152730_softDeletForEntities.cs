using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedFuture.Server.Migrations
{
    /// <inheritdoc />
    public partial class softDeletForEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
    name: "IsDeleted",
    table: "Doctor",
    type: "bit",
    nullable: false,
    defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Patient",
                type: "bit",
                nullable: false,
                defaultValue: false);



            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "UserID",
                keyValue: 1,
                columns: new[] { "Email", "FirebaseID" },
                values: new object[] { "slimshady0632@gmail.com", "xDxz86iwctc9hI95uReZYzqEdmv1" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Doctor");

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "UserID",
                keyValue: 1,
                columns: new[] { "Email", "FirebaseID" },
                values: new object[] { "admin123@gmail.com", "gTl85s5wAwZQPxfhIxlWqihtLWF3" });
        }
    }
}
