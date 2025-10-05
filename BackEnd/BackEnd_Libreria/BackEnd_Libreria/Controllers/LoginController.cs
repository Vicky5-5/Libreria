using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BackEnd_Libreria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly Conexion _conexion;
        private readonly IConfiguration _config;

        public LoginController(Conexion conexion, IConfiguration configuration)
        {
            _config = configuration;
            _conexion = conexion;
        }
        // Método para hashear la contraseña (usado en el registro) y tener más seguridad
        private (string hash, string salt) HashPassword(string password) //Tiene una tupla que hace que se devuelvan los valores
        {
            //Generamos un valor aleatorio para evitar ataques por diccionario y rainbow tables
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            //Convertimos el salt a base64 para almacenarlo como string en la base de datos
            string salt = Convert.ToBase64String(saltBytes);

            // Derivamos una subclave (hash) del password usando PBKDF2 que es un algoritmo seguro para contraseñas con HMACSHA256
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: saltBytes,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000, //Número de iteraciones para hacer el hash más seguro
            numBytesRequested: 32)); //Se genera 32 bytes para el hash que es 256 bits

            return (hash, salt);
        }
        private bool VerificarPassword(string password, string storedHash, string storedSalt)
        {
            // Convertimos el salt guardado de texto a bytes
            byte[] saltBytes = Convert.FromBase64String(storedSalt);
            // Se aplica el mimso proceso de hash que en el método HashPassword
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32));
            // Comparamos el hash generado con el hash almacenado
            return hash == storedHash;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] Login request)
        {

            var usuario = _conexion.Usuarios.FirstOrDefault(u => u.Email == request.Email);
            if (usuario == null)
            {
                return BadRequest(new { isSuccess = false, message = "Usuario no encontrado." });
            }

            bool valido = VerificarPassword(request.Password, usuario.Password, usuario.Salt);
            if (!valido)
            {
                return BadRequest(new { isSuccess = false, message = "Contraseña incorrecta." });
            }

            var token = GenerarToken(usuario.Email);
            return Ok(new { isSuccess = true, token });
        }
        [HttpPost("Registrarse")]
        public IActionResult Registrarse([FromBody] RegistroDTO modelo)
        {
            if (string.IsNullOrEmpty(modelo.Email) || string.IsNullOrEmpty(modelo.Password))
            {
                return BadRequest(new { isSuccess = false, message = "Email y contraseña son obligatorios." });
            }

            if (_conexion.Usuarios.Any(u => u.Email == modelo.Email))
            {
                return BadRequest(new { isSuccess = false, message = "El email ya está registrado." });
            }
            var nuevoUsuario = new Usuario
            {
                Nombre = modelo.Nombre,
                Email = modelo.Email,
                FechaRegistro = DateTime.Now,
                Estado = true,
                Admin = false,
            };

            var (hash, salt) = HashPassword(modelo.Password);
            nuevoUsuario.Password = hash;
            nuevoUsuario.Salt = salt;

            _conexion.Usuarios.Add(nuevoUsuario);
            _conexion.SaveChanges();

            var token = GenerarToken(nuevoUsuario.Email);
            return Ok(new { isSuccess = true, token });
        }

        private string GenerarToken(string usuario)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, usuario)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
       
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
