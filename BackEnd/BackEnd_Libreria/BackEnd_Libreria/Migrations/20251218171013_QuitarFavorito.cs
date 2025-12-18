using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd_Libreria.Migrations
{
    /// <inheritdoc />
    public partial class QuitarFavorito : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "Libros",
                schema: "dbo",
                columns: table => new
                {
                    idLibro = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RutaArchivoPortada = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Autor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RutaArchivoPDF = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    yearPublicacion = table.Column<int>(type: "int", nullable: false),
                    Genero = table.Column<int>(type: "int", nullable: false),
                    Idioma = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sinopsis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Disponibilidad = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Libros", x => x.idLibro);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Libros",
                schema: "dbo");
        }

    }
}
