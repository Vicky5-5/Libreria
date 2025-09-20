using BackEnd_Libreria.Models;
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

        [HttpGet]
        public ActionResult<IEnumerable<Usuario>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Usuario> Get(int id)
        {
            var usuario = _service.GetById(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        [HttpPost]
        public ActionResult<Usuario> Create(Usuario usuario)
        {
            var nuevo = _service.Add(usuario);
            return CreatedAtAction(nameof(Get), new { id = nuevo.idUsuario }, nuevo);
        }

        [HttpPut("{id}")]
        public IActionResult Actualizar(int id, Usuario usuario)
        {
            if (!_service.Actualizar(id, usuario)) return NotFound();
            return NoContent();
        }
        // Para dar de baja
        [HttpDelete("{id}")]
        public IActionResult DarBaja(int id)
        {
            if (!_service.DarBaja(id)) return NotFound();
            return NoContent(); // 204
        }
        [HttpPut("{id}/DarAltaDeNuevo")]
        public IActionResult Reactivar(int id)
        {
            var resultado = _service.DarAltaDeNuevo(id);
            if (!resultado) return NotFound();
            return NoContent();
        }
        // Para obtener solo los usuarios activos
        [HttpGet("Activos")]
        public ActionResult<IEnumerable<Usuario>> GetAllActivos()
        {
            var usuariosActivos = _service.GetAll().Where(u => u.Estado);
            return Ok(usuariosActivos);
        }

    }
}
