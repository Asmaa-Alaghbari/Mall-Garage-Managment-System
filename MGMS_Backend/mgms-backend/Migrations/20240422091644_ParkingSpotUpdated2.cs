﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mgms_backend.Migrations
{
    /// <inheritdoc />
    public partial class ParkingSpotUpdated2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "ParkingSpots");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "ParkingSpots",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
