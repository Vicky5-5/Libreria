using BackEnd_Libreria.Models.Libros;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BackEnd_Libreria.Contexto
{
    public class Conexion : DbContext
    {
        public Conexion()
        {

        }
        public Conexion(DbContextOptions<Conexion> options) : base(options) { }


        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Libros> Libros{ get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = "Server=DESKTOP-F14E1IH\\SQLEXPRESS;Database=Libreria;Trusted_Connection=True;TrustServerCertificate=True;"; // o desde config
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
