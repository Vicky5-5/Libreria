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

            builder.Entity<Usuario>(entity => 
            {
                entity.ToTable("Usuarios");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id)
                      .HasColumnName("idUsuario")
                      .ValueGeneratedOnAdd();
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
    
