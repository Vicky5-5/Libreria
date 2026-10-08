using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd_Libreria.Migrations
{
    /// <inheritdoc />
    public partial class AddDescript : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Editado",
                table: "MensajesGrupo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "MensajesGrupo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "ChatGrupoUsuarios",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaSalida",
                table: "ChatGrupoUsuarios",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "ChatGrupos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Editado",
                table: "MensajesGrupo");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "MensajesGrupo");

            migrationBuilder.DropColumn(
                name: "Activo",
                table: "ChatGrupoUsuarios");

            migrationBuilder.DropColumn(
                name: "FechaSalida",
                table: "ChatGrupoUsuarios");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "ChatGrupos");
        }
    }
}
