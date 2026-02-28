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
    [Route("api/auth")]
    public class LoginController : Controller
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly IConfiguration _config;
        private readonly ILogger<LoginController> _logger;

        public LoginController(
            UserManager<Usuario> userManager,
            SignInManager<Usuario> signInManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpPost("login")]
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
                DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
