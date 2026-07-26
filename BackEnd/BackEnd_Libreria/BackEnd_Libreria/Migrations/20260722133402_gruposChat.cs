using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd_Libreria.Migrations
{
    /// <inheritdoc />
    public partial class gruposChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatGrupos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreadorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatGrupos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatGrupos_Usuarios_CreadorId",
                        column: x => x.CreadorId,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChatGrupoUsuarios",
                columns: table => new
                {
                    GrupoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsuarioId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Admin = table.Column<bool>(type: "bit", nullable: false),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatGrupoUsuarios", x => new { x.GrupoId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_ChatGrupoUsuarios_ChatGrupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "ChatGrupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatGrupoUsuarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MensajesGrupo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChatGrupoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmisorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Mensaje = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MensajesGrupo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MensajesGrupo_ChatGrupos_ChatGrupoId",
                        column: x => x.ChatGrupoId,
                        principalTable: "ChatGrupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MensajesGrupo_Usuarios_EmisorId",
                        column: x => x.EmisorId,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatGrupos_CreadorId",
                table: "ChatGrupos",
                column: "CreadorId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGrupoUsuarios_GrupoId",
                table: "ChatGrupoUsuarios",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGrupoUsuarios_UsuarioId",
                table: "ChatGrupoUsuarios",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_MensajesGrupo_ChatGrupoId",
                table: "MensajesGrupo",
                column: "ChatGrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_MensajesGrupo_ChatGrupoId_Fecha",
                table: "MensajesGrupo",
                columns: new[] { "ChatGrupoId", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_MensajesGrupo_EmisorId",
                table: "MensajesGrupo",
                column: "EmisorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatGrupoUsuarios");

            migrationBuilder.DropTable(
                name: "MensajesGrupo");

            migrationBuilder.DropTable(
                name: "ChatGrupos");
        }
    }
}
