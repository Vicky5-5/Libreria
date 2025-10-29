using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models.Libros;
using BackEnd_Libreria.Models.Usuario;
using BackEnd_Libreria.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var origenesPermitidos = builder.Configuration
    .GetSection("OrigenesPermitidos")
    .Get<string[]>();
// Servicios
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ILibrosService, LibrosService>();


builder.Services.AddDbContext<Conexion>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Libreria")));

// Configuración de Identity
builder.Services.AddIdentity<Usuario, IdentityRole>()
    .AddEntityFrameworkStores<Conexion>()
    .AddDefaultTokenProviders();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("OrigenesPermitidos").Get<string[]>())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var adminSection = builder.Configuration.GetSection("DefaultAdmin");
var adminEmail = adminSection["Email"];
var adminPassword = adminSection["Password"];



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });
// Para subir archivos. Si son grandes, aumenta el límite aumenta el límite:
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 100_000_000; // 100 MB
});
// Configurar Kestrel para aceptar grandes cargas de archivos
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 100_000_000; // 100 MB
});
builder.Services.AddScoped<ILibrosService, LibrosService>();
builder.Services.AddDbContext<Conexion>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Libreria")));

var app = builder.Build();

// Crear el usuario administrador por defecto si no existe
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await Conexion.SeedAdminAsync(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Portadas")),
    RequestPath = "/Portadas"
});

app.UseCors("AllowAngularDevClient");
app.UseStaticFiles();
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

