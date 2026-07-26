using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.ChatGrupal;
using BackEnd_Libreria.Models.Libros;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_Libreria.Contexto
{
    public class Conexion : IdentityDbContext<Usuario>
    {
        public Conexion() { }

        public Conexion(DbContextOptions<Conexion> options) : base(options) { }

        public DbSet<Libros> Libros { get; set; }
        public DbSet<MensajeChat> MensajesChat { get; set; }

        public DbSet<ChatGrupo> ChatGrupos { get; set; }
        public DbSet<ChatGrupoUsuario> ChatGrupoUsuarios { get; set; }
        public DbSet<MensajeGrupo> MensajesGrupo { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = "Server=DESKTOP-F14E1IH\\SQLEXPRESS;Database=Libreria;Trusted_Connection=True;TrustServerCertificate=True;";
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //USUARIOS

            builder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id)
                      .HasColumnName("idUsuario")
                      .ValueGeneratedOnAdd();
            });

            // USUARIOS - MENSAJES CHAT
            builder.Entity<MensajeChat>(entity =>
            {
                entity.ToTable("MensajesChat");
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Id)
                      .HasColumnName("idMensaje")
                      .ValueGeneratedOnAdd();

                entity.Property(m => m.Mensaje)
                      .HasMaxLength(2000)
                      .IsRequired();

                entity.Property(m => m.Fecha)
                      .IsRequired();

                // Índice para buscar conversaciones entre dos usuarios rápido
                entity.HasIndex(m => new { m.EmisorId, m.DestinatarioId });

                // Relación con el emisor
                entity.HasOne(m => m.Emisor)
                      .WithMany()
                      .HasForeignKey(m => m.EmisorId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relación con el destinatario
                entity.HasOne(m => m.Destinatario)
                      .WithMany()
                      .HasForeignKey(m => m.DestinatarioId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // CHAT GRUPAL
            // Configuración de la relación muchos a muchos entre ChatGrupo y Usuario. Para evitar duplicidad

            builder.Entity<ChatGrupoUsuario>()
    .HasKey(x => new { x.GrupoId, x.UsuarioId });

            builder.Entity<ChatGrupoUsuario>()
                .HasOne(x => x.Grupo)
                .WithMany(x => x.Usuarios)
                .HasForeignKey(x => x.GrupoId);

            builder.Entity<ChatGrupoUsuario>()
                .HasOne(x => x.Usuario)
                .WithMany()
                .HasForeignKey(x => x.UsuarioId);
            builder.Entity<ChatGrupo>(entity =>
            {
                entity.ToTable("ChatGrupos");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Nombre)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(x => x.FechaCreacion)
                      .IsRequired();

                entity.HasOne(x => x.Creador)
                      .WithMany()
                      .HasForeignKey(x => x.CreadorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // USUARIOS DEL GRUPO

            builder.Entity<ChatGrupoUsuario>(entity =>
            {
                entity.ToTable("ChatGrupoUsuarios");

                // Clave primaria compuesta
                entity.HasKey(x => new
                {
                    x.GrupoId,
                    x.UsuarioId
                });

                entity.HasOne(x => x.Grupo)
                      .WithMany(x => x.Usuarios)
                      .HasForeignKey(x => x.GrupoId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Usuario)
                      .WithMany()
                      .HasForeignKey(x => x.UsuarioId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.GrupoId);

                entity.HasIndex(x => x.UsuarioId);
            });

            // MENSAJES DEL GRUPO

            builder.Entity<MensajeGrupo>(entity =>
            {
                entity.ToTable("MensajesGrupo");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                      .ValueGeneratedOnAdd();

                entity.Property(x => x.Mensaje)
                      .HasMaxLength(2000)
                      .IsRequired();

                entity.Property(x => x.Fecha)
                      .IsRequired();

                entity.HasOne(x => x.ChatGrupo)
                      .WithMany(x => x.Mensajes)
                      .HasForeignKey(x => x.ChatGrupoId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Emisor)
                      .WithMany()
                      .HasForeignKey(x => x.EmisorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.ChatGrupoId);

                entity.HasIndex(x => new
                {
                    x.ChatGrupoId,
                    x.Fecha
                });
            });
        }


        // Método para crear el usuario administrador por defecto que se encuentra en appsettings.json
        public static async Task SeedAdminAsync(IServiceProvider services)
        {
            // Obtenemos los servicios necesarios
            var config = services.GetRequiredService<IConfiguration>(); // Configuración para leer appsettings.json
            var userManager = services.GetRequiredService<UserManager<Usuario>>(); // Gestión y creación de usuarios
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>(); // Gestión y creación de roles

            // Leemos los datos del administrador por defecto desde la configuración
            var adminNombre = config["DefaultAdmin:Nombre"];
            var adminEmail = config["DefaultAdmin:Email"];
            var adminPassword = config["DefaultAdmin:Password"];

            // Verificamos si el rol "Admin" existe, si no, lo creamos
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var nuevoAdmin = new Usuario
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Nombre = adminNombre,
                    EmailConfirmed = true,
                    Admin = true,
                    Estado = true,
                    FechaRegistro = DateTime.Now
                };

                // Creamos el usuario administrador
                var result = await userManager.CreateAsync(nuevoAdmin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(nuevoAdmin, "Admin");
                    Console.WriteLine("Administrador por defecto creado.");
                }
                else
                {
                    Console.WriteLine("Error al crear el administrador por defecto.");
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"Código: {error.Code} - Descripción: {error.Description}");
                    }
                }

            }
        }
    }
}
    
