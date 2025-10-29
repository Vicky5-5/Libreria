using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackEnd_Libreria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly IConfiguration _config;

        public LoginController(
            UserManager<Usuario> userManager,
            SignInManager<Usuario> signInManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Login request)
        {
            var usuario = await _userManager.FindByEmailAsync(request.Email);
            if (usuario == null)
                return BadRequest(new { isSuccess = false, message = "Usuario no encontrado." });

            var result = await _signInManager.CheckPasswordSignInAsync(usuario, request.Password, false);
            if (!result.Succeeded)
                return BadRequest(new { isSuccess = false, message = "Contraseña incorrecta." });
                       
            var token = GenerarToken(usuario);
            return Ok(new { isSuccess = true, token });
        }

        [HttpPost("Registrarse")]
        public async Task<IActionResult> Registrarse([FromBody] RegistroDTO modelo)
        {
            if (string.IsNullOrEmpty(modelo.Email) || string.IsNullOrEmpty(modelo.Password))
                return BadRequest(new { isSuccess = false, message = "Email y contraseña son obligatorios." });

            var existe = await _userManager.FindByEmailAsync(modelo.Email);
            if (existe != null)
                return BadRequest(new { isSuccess = false, message = "El email ya está registrado." });

            var nuevoUsuario = new Usuario
            {
                UserName = modelo.Email,
                Email = modelo.Email,
                Nombre = modelo.Nombre,
                FechaRegistro = DateTime.Now,
                Estado = true,
                Admin = false
            };

            var result = await _userManager.CreateAsync(nuevoUsuario, modelo.Password);
            if (!result.Succeeded)
                return BadRequest(new { isSuccess = false, message = "Error al registrar usuario.", errors = result.Errors });

            var token = GenerarToken(nuevoUsuario);
            return Ok(new { isSuccess = true, token });
        }

        private string GenerarToken(Usuario usuario)
        {
            var roles = _userManager.GetRolesAsync(usuario).Result;

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, usuario.Email),
        new Claim("role", roles.FirstOrDefault() ?? "Usuario") // ✅ Aquí se incluye el rol
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
