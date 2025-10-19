using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Usuario;
using BackEnd_Libreria.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd_Libreria.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuarioController(IUsuarioService service)
        {
            _service = service;
        }

        // Obtenemos todos los usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAll()
        {
            var usuarios = await _service.GetAllAsync();
            return Ok(usuarios);
        }
        // Obtenemos todos los usuarios activos
        [HttpGet("Activos")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAllActivos()
        {
            var activos = await _service.GetAllActivosAsync();
            return Ok(activos);
        }
        // Obtenemos un usuario por su ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(string id)
        {
            var usuario = await _service.GetByIdAsync(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        [HttpPost("Registrar")]
        public async Task<ActionResult<Usuario>> Registrar([FromBody] RegistroDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var nuevoUsuario = new Usuario
            {
                UserName = dto.Email,
                Email = dto.Email,
                Nombre = dto.Nombre,
                EmailConfirmed = true,
                Estado = true,
                Admin = false
            };

            var creado = await _service.AddAsync(nuevoUsuario, dto.Password);
            return CreatedAtAction(nameof(Get), new { id = creado.Id }, creado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(string id, [FromBody] Usuario usuario)
        {
            var actualizado = await _service.ActualizarAsync(id, usuario);
            if (!actualizado) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DarBaja(string id)
        {
            var resultado = await _service.DarBajaAsync(id);
            if (!resultado) return NotFound();
            return NoContent();
        }

        [HttpPut("{id}/DarAltaDeNuevo")]
        public async Task<IActionResult> Reactivar(string id)
        {
            var resultado = await _service.DarAltaDeNuevoAsync(id);
            if (!resultado) return NotFound();
            return NoContent();
        }
    }
}
