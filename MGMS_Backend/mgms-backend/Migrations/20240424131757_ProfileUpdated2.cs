using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mgms_backend.Migrations
{
    /// <inheritdoc />
    public partial class ProfileUpdated2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePicture",
                table: "Profiles");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "Profiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "Profiles");

            migrationBuilder.AddColumn<byte[]>(
                name: "ProfilePicture",
                table: "Profiles",
                type: "bytea",
                nullable: true);
        }
    }
}
