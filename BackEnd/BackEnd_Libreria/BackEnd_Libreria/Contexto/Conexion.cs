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


        public static async Task SeedAdminAsync(IServiceProvider services)
        {
            var userManager = services.GetRequiredService<UserManager<Usuario>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var config = services.GetRequiredService<IConfiguration>();

            var email = config["DefaultAdmin:Email"];
            var password = config["DefaultAdmin:Password"];
            var nombre = config["DefaultAdmin:Nombre"];

            if (await userManager.FindByEmailAsync(email) == null)
            {
                var admin = new Usuario
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    Nombre = nombre,
                    Admin = true
                };

                var result = await userManager.CreateAsync(admin, password);

                if (result.Succeeded)
                {
                    if (!await roleManager.RoleExistsAsync("Admin"))
                        await roleManager.CreateAsync(new IdentityRole("Admin"));

                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}
    
