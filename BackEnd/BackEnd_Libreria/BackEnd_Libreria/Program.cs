using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.ExceptionMiddleware;
using BackEnd_Libreria.Hub;
using BackEnd_Libreria.Models.Libros;
using BackEnd_Libreria.Models.Usuario;
using BackEnd_Libreria.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
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

// Base de datos
builder.Services.AddDbContext<Conexion>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Libreria")));

// Configuración de Identity
builder.Services.AddIdentity<Usuario, IdentityRole>()
    .AddEntityFrameworkStores<Conexion>()
    .AddDefaultTokenProviders();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins(origenesPermitidos)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ⭐ Necesario para SignalR
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

var adminSection = builder.Configuration.GetSection("DefaultAdmin");
var adminEmail = adminSection["Email"];
var adminPassword = adminSection["Password"];

// Configuración de autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero, // Elimina el tiempo de gracia para expiración
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };

        // IMPORTANTE PARA SIGNALR + JWT
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/chat"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

// Para subir archivos. Si son grandes, aumenta el límite:
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 100_000_000; // 100 MB
});

// Configurar Kestrel para aceptar grandes cargas de archivos
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 100_000_000; // 100 MB
});

// Asegurarse de que la carpeta de logs exista

Directory.CreateDirectory("Logs");

// CONFIGURACIÓN DE SERILOG. ESTO SIRVE PARA REGISTRAR LOGS EN ARCHIVOS TXT Y/O BASES DE DATOS
Log.Logger = new LoggerConfiguration()

    .MinimumLevel.Error()

    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)

    .Enrich.FromLogContext()

    // EL ERROR SE REGISTRAR EN UN ARCHIVO TXT
    .WriteTo.File(
        path: "Logs/errors-.txt",
        rollingInterval: RollingInterval.Day,
        restrictedToMinimumLevel: LogEventLevel.Error,
        retainedFileCountLimit: 15
    )
    .CreateLogger();

// SE CONECTA SERILOG CON LA APLICACIÓN
builder.Host.UseSerilog();

// SignalR
builder.Services.AddSignalR();

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

// Redirección HTTPS primero
app.UseHttpsRedirection();

// ⭐ Routing ANTES de CORS y Auth
app.UseRouting();

// Configurar CORS antes de auth
app.UseCors("AllowAngularDevClient");

// Autenticación y autorización antes de endpoints
app.UseAuthentication();
app.UseAuthorization();

// Servir archivos estáticos desde la carpeta Portadas
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Portadas")),
    RequestPath = "/Portadas"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "pdfs")),
    RequestPath = "/pdfs"
});

app.UseMiddleware<ExceptionMiddleware>();
app.MapControllers();

app.MapHub<ChatHub>("/chat");

// Nos aseguramos de cerrar y guardar los logs al finalizar la aplicación

try
{
    app.Run();
}
finally
{
    Log.CloseAndFlush();
}

