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
        private readonly ILogger<LibrosController> _logger;

        public LibrosController(ILibrosService service, ILogger<LibrosController> logger)
        {
            _service = service;
            _logger = logger;
        }
        // GET: api/Libros

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LibroDetalleDTO>>> GetAll()
        {
            var libros = await _service.GetAll();

            if (!libros.Any())
            {
                _logger.LogInformation("No se encontraron libros en la base de datos.");
                return Ok(new
                {
                    isSuccess = true,
                    message = "No se encontraron libros",
                    data = new List<LibroDetalleDTO>()
                });
            }

            var librosDTO = libros.Select(libro => new LibroDetalleDTO
            {
                idLibro = libro.idLibro,
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

            _logger.LogInformation("Libros cargados correctamente. Total: {Total}", librosDTO.Count);

            return Ok(new
            {
                isSuccess = true,
                message = "Libros cargados correctamente",
                data = librosDTO
            });
        }
        

        [HttpGet("{id}")]
        public async Task<ActionResult<LibroDetalleDTO>> GetById(Guid id)
        {
            var libro = await _service.GetById(id);
            if (libro == null) { 
                _logger.LogWarning("Libro con ID {Id} no encontrado.", id);
                return NotFound(new
                {
                    isSuccess = false,
                    message = "Libro no encontrado"
                });
            }

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
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            var libro = await _service.Add(dto);

            if (libro == null)
            {
                _logger.LogError("Error al crear el libro.");
                return BadRequest(new
                {
                    isSuccess = false,
                    message = "Error al crear el libro"
                });
            }

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

            if (libroActualizado == null) { 
            _logger.LogWarning("No se pudo actualizar el libro con ID {Id} porque no fue encontrado.", id);
                return BadRequest(new
                {
                    isSuccess = false,
                    message = "No se pudo actualizar el libro porque no fue encontrado"
                });
            }

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
            if (!eliminado) { 
            _logger.LogWarning("No se pudo eliminar el libro con ID {Id} porque no fue encontrado.", id);
                return NotFound(new
                {
                    isSuccess = false,
                    message = "No se pudo eliminar el libro porque no fue encontrado"
                });
            }
            _logger.LogInformation("Libro eliminado correctamente. Id: {Id}", id);

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

        [HttpPost("{id}/noDisponible")]
        public async Task<IActionResult> ActualizarDisponibilidad(Guid id, bool disponibilidad)
        {
            var libroActualizado = await _service.LibroNoDisponible(id, disponibilidad);
            if (libroActualizado == null) return NotFound();
            return Ok(new
            {
                isSuccess = true,
                message = "Disponibilidad del libro actualizada correctamente",
                data = libroActualizado
            });
        }

        [HttpPost("{id}/disponible")]
        public async Task<IActionResult> ActualizarDisponibilidadDisponible(Guid id, bool disponibilidad)
        {
            var libroActualizado = await _service.LibroDisponible(id, disponibilidad);
            if (libroActualizado == null) return NotFound();
            return Ok(new
            {
                isSuccess = true,
                message = "Disponibilidad del libro actualizada correctamente",
                data = libroActualizado
            });
        }
    }
}
