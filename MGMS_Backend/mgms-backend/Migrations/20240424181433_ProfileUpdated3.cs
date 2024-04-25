using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mgms_backend.Migrations
{
    /// <inheritdoc />
    public partial class ProfileUpdated3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Profiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
