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

        public ActionResult<UsuarioDTO> DarBajaUsuario(string id)
        {
            //Buscar el usuario por id  
            var usuario = _service.GetById(id);
            //Si no existe, devolver NotFound
            if (usuario == null) return NotFound();
            //Si existe, cambiar su estado a false y la fecha de baja al dia de hoy
            usuario.Estado = false;
            usuario.FechaBaja = DateTime.Now;
            _service.Actualizar(id, usuario);
            var usuarioDTO = new UsuarioDTO
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Admin = usuario.Admin,
                Estado = usuario.Estado,
                FechaBaja = usuario.FechaBaja,
                FechaRegistro = usuario.FechaRegistro
            };
            return Ok(new
            {
                isSuccess = true,
                message = "Usuario dado de baja correctamente",
                data = usuarioDTO
            });
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
