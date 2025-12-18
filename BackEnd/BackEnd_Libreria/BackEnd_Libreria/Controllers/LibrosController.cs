using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Libros;
using Microsoft.AspNetCore.Mvc;
namespace BackEnd_Libreria.Controllers
{

    //Controlador para la gestión de libros en modo adminsitrador

    [ApiController]
    [Route("api/[controller]")]
    public class LibrosController : ControllerBase
    {
        private readonly ILibrosService _service;

        public LibrosController(ILibrosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LibroDetalleDTO>>> GetAll()
        {
            var libros = (await _service.GetAll())
                .Select(libro => new LibroDetalleDTO
                {
                    Titulo = libro.Titulo,
                    Autor = libro.Autor,
                    yearPublicacion = libro.yearPublicacion,
                    Genero = libro.Genero,
                    Idioma = libro.Idioma,
                    Sinopsis = libro.Sinopsis,
                    Disponibilidad = libro.Disponibilidad,
                    RutaArchivoPortada = libro.RutaArchivoPortada,
                    RutaArchivoPDF = libro.RutaArchivoPDF
                }).ToList();

            return Ok(new
            {
                isSuccess = true,
                message = "Libros cargados correctamente",
                data = libros
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LibroDetalleDTO>> GetById(Guid id)
        {
            var libro = await _service.GetById(id);
            if (libro == null) return NotFound();

            var dto = new LibroDetalleDTO
            {
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                yearPublicacion = libro.yearPublicacion,
                Genero = libro.Genero,
                Idioma = libro.Idioma,
                Sinopsis = libro.Sinopsis,
                Disponibilidad = libro.Disponibilidad,
                RutaArchivoPortada = libro.RutaArchivoPortada,
                RutaArchivoPDF = libro.RutaArchivoPDF
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CrearLibroDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var libro = await _service.Add(dto);

            return CreatedAtAction(nameof(GetById), new { id = libro.idLibro }, new
            {
                isSuccess = true,
                message = "Libro creado correctamente",
                data = libro
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(Guid id, [FromForm] EditarLibroDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var libroActualizado = await _service.Actualizar(id, dto);
            if (libroActualizado == null) return NotFound();

            return Ok(new
            {
                isSuccess = true,
                message = "Libro actualizado correctamente",
                data = libroActualizado
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var eliminado = await _service.Delete(id);
            if (!eliminado) return NotFound();

            return NoContent();
        }

        [HttpGet("descargar/{nombreArchivo}")]
        public IActionResult DescargarLibro(string nombreArchivo)
        {
            var ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pdfs", nombreArchivo);

            if (!System.IO.File.Exists(ruta)) return NotFound("El archivo no existe.");

            var tipoContenido = "application/pdf";
            var bytes = System.IO.File.ReadAllBytes(ruta);

            return File(bytes, tipoContenido, nombreArchivo);
        }
    }
}
