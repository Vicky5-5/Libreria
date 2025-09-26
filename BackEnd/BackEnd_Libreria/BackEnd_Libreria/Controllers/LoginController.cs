using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IConfiguration _config;

        public LoginController(IConfiguration config)
        {
            _config = config;
        }
        // Método para hashear la contraseña (usado en el registro) y tener más seguridad
        public string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {

            if (request.Email == "admin@admin.com" && request.Password == "1234567890")
            {
                var token = GenerarToken(request.Email);
                return Ok(new { isSuccess = true, token });
            }

            return BadRequest(new { isSuccess = false, message = "Credenciales inválidas" });
        }
        [HttpPost("Registrarse")]
        public IActionResult Registrarse([FromBody] Usuario usuario)

        {
            // Validación básica
            if (string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Password))
            {
                return BadRequest(new { isSuccess = false, message = "Email y contraseña son obligatorios." });
            }            

            var token = GenerarToken(usuario.Email);
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
