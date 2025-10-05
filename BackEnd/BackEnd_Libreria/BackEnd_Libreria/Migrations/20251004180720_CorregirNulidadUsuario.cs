﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd_Libreria.Migrations
{
    /// <inheritdoc />
    public partial class CorregirNulidadUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Usuarios");
        }
    }
}
