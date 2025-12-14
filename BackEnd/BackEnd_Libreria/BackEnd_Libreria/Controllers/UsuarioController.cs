using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Usuario;
using BackEnd_Libreria.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd_Libreria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;
        private readonly ILogger<UsuarioController> _logger;
        public UsuarioController(IUsuarioService service, ILogger <UsuarioController>logger)
        {
            _service = service;
            _logger =logger;
        }

        // Obtenemos todos los usuarios
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioDTO>> GetAll()
        {
            var usuarios = _service.GetAll();

            var usuariosDTO = usuarios.Select(usuario => new UsuarioDTO
            {
                Id = usuario.Id,
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

        //Este metodo registra un nuevo usuario (EL ADMINISTRADOR)
        // Usa el DTO CrearUsuarioDTO para recibir los datos necesarios y no usar el modelo completo de Usuario
        [HttpPost("Registrar")]
        public async Task<ActionResult<UsuarioDTO>> Registrar([FromBody] CrearUsuarioDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nuevoUsuario = new Usuario
            {
                UserName = dto.Email,
                Email = dto.Email,
                Nombre = dto.Nombre,
                Estado = dto.Estado,
                Admin = dto.Admin,
                EmailConfirmed = true
            };

            var creado = await _service.Add(nuevoUsuario, dto.Password);

            if (creado == null)
                return BadRequest("No se pudo crear el usuario.");

            
            var usuarioDTO = new UsuarioDTO
            {
                Id = creado.Id,
                Nombre = creado.Nombre,
                Email = creado.Email,
                Estado = creado.Estado,
                Admin = creado.Admin,
                FechaRegistro = creado.FechaRegistro,
                FechaBaja = creado.FechaBaja
            };

            return CreatedAtAction(nameof(Get), new { id = creado.Id }, usuarioDTO);
        }

        [HttpPost("{id}/baja")]
        public async Task<ActionResult> DarBajaUsuario(string id)
        {
            var usuario = _service.GetById(id);
            if (usuario == null) return NotFound();

            var ok = await _service.DarBajaUsuario(id);
            if (!ok) return BadRequest();

            return Ok(new
            {
                isSuccess = true,
                message = "Usuario dado de baja correctamente"
            });
        }
        [HttpPost("{id}/alta")]
        public async Task<ActionResult> DarAltaUsuario(string id)
        {
            var usuario = _service.GetById(id);
            if (usuario == null) return NotFound();

            var ok = await _service.DarAltaUsuario(id);
            if (!ok) return BadRequest();

            return Ok(new
            {
                isSuccess = true,
                message = "Usuario dado de alta correctamente"
            });
        }



        [HttpPut("{Id}")]
        public async Task<ActionResult> Editar(string Id, [FromBody] EditarUsuarioDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var usuarioActualizado = await _service.Actualizar(Id, dto);
            if (usuarioActualizado == null) return NotFound();

            var usuarioDTO = new UsuarioDTO
            {
                Id = usuarioActualizado.Id,
                Nombre = usuarioActualizado.Nombre,
                Email = usuarioActualizado.Email,
                Admin = usuarioActualizado.Admin,
                Estado = usuarioActualizado.Estado,
                FechaRegistro = usuarioActualizado.FechaRegistro,
                FechaBaja = usuarioActualizado.FechaBaja
            };

            return Ok(new
            {
                isSuccess = true,
                message = "Usuario actualizado correctamente",
                data = usuarioDTO
            });
        }





        //[HttpDelete("{id}")]
        //public ActionResult DarBaja(string id)
        //{
        //    var resultado = _service.DarBaja(id);
        //    if (!resultado) return NotFound();
        //    return NoContent();
        //}

        //[HttpPut("{id}/DarAltaDeNuevo")]
        //public ActionResult Reactivar(string id)
        //{
        //    var resultado = _service.DarAltaDeNuevo(id);
        //    if (!resultado) return NotFound();
        //    return NoContent();
        //}
    }
}
