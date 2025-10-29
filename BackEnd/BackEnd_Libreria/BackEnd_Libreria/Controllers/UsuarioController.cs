using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Usuario;
using BackEnd_Libreria.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

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
        public ActionResult<IEnumerable<UsuarioDTO>> GetAll()
        {
            var usuarios = _service.GetAll();

            var usuariosDTO = usuarios.Select(usuario => new UsuarioDTO
            {
                Id = (int.Parse(usuario.Id)),
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Admin = usuario.Admin,
                Estado = usuario.Estado,
                FechaBaja = usuario.FechaBaja,
                FechaRegistro = usuario.FechaRegistro
            });

            return Ok(new
            {
                isSuccess = true,
                message = "Usuarios cargados correctamente",
                data = usuariosDTO
            });
        }

        // Obtenemos todos los usuarios activos
        [HttpGet("Activos")]
        public ActionResult<IEnumerable<Usuario>> GetAllActivos()
        {
            var activos = _service.GetAllActivos(); 
            return Ok(activos);
        }

        // Obtenemos un usuario por su ID
        [HttpGet("{id}")]
        public ActionResult<Usuario> Get(string id)
        {
            var usuario = _service.GetById(id);
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

            var creado = _service.Add(nuevoUsuario, dto.Password);
            return CreatedAtAction(nameof(Get), new { id = creado.Id }, creado);
        }

        [HttpPut("{id}")]
        public ActionResult Actualizar(string id, [FromBody] Usuario usuario)
        {
            var actualizado = _service.Actualizar(id, usuario); 
            if (!actualizado) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DarBaja(string id)
        {
            var resultado = _service.DarBaja(id);
            if (!resultado) return NotFound();
            return NoContent();
        }

        [HttpPut("{id}/DarAltaDeNuevo")]
        public ActionResult Reactivar(string id)
        {
            var resultado = _service.DarAltaDeNuevo(id);
            if (!resultado) return NotFound();
            return NoContent();
        }
    }
}
