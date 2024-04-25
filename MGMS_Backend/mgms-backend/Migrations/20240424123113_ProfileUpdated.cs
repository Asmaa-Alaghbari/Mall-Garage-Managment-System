using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mgms_backend.Migrations
{
    /// <inheritdoc />
    public partial class ProfileUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Preferences",
                table: "Profiles",
                newName: "ZipCode");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<byte[]>(
                name: "ProfilePicture",
                table: "Profiles",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProfilePicture",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Profiles");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "Profiles",
                newName: "Preferences");
        }
    }
}
