using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Libros;
using Microsoft.AspNetCore.Mvc;
namespace BackEnd_Libreria.Controllers
{
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
        public ActionResult<IEnumerable<LibroDetalleDTO>> GetAll() {
            var libros = _service.GetAll()
            .Select(libro => new LibroDetalleDTO
            {
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                yearPublicacion = libro.yearPublicacion,
                Genero = (int)libro.Genero,
                Idioma = libro.Idioma,
                Sinopsis = libro.Sinopsis,
                Disponibilidad = libro.Disponibilidad,
                Favorito = libro.Favorito,
            });
            return Ok(new
            {
                isSuccess = true,
                message = "Libros cargados correctamente",
                data = libros
            });
        }

        [HttpGet("{id}")]
        public ActionResult<LibroDetalleDTO> Get(int id)
        {
            var libro = _service.GetById(id);
            if (libro == null) return NotFound();

            var dto = new LibroDetalleDTO
            {
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                yearPublicacion = libro.yearPublicacion,
                Genero = (int)libro.Genero,
                Idioma = libro.Idioma,
                Sinopsis = libro.Sinopsis,
                Disponibilidad = libro.Disponibilidad,
                Favorito = libro.Favorito
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] LibrosDTO dto)
        {
            var libro = new Libros
            {
                Titulo = dto.Titulo,
                Autor = dto.Autor,
                yearPublicacion = dto.yearPublicacion,
                Genero = (Genero)dto.Genero,
                Idioma = dto.Idioma,
                Sinopsis = dto.Sinopsis,
                Disponibilidad = dto.Disponibilidad,
                Favorito = dto.Favorito
            };

            if (dto.ArchivoPDF != null)
            {
                var pdfName = Guid.NewGuid() + Path.GetExtension(dto.ArchivoPDF.FileName);
                var pdfFolder = Path.Combine(Directory.GetCurrentDirectory(), "pdfs");
                Directory.CreateDirectory(pdfFolder);

                var pdfPath = Path.Combine(pdfFolder, pdfName);
                using var stream = new FileStream(pdfPath, FileMode.Create);
                await dto.ArchivoPDF.CopyToAsync(stream);

                libro.RutaArchivoPDF = $"/pdfs/{pdfName}";
            }

            if (dto.Portada != null)
            {
                var portadaName = Guid.NewGuid() + Path.GetExtension(dto.Portada.FileName);
                var portadaFolder = Path.Combine(Directory.GetCurrentDirectory(), "Portadas");
                Directory.CreateDirectory(portadaFolder);

                var portadaPath = Path.Combine(portadaFolder, portadaName);
                using var stream = new FileStream(portadaPath, FileMode.Create);
                await dto.Portada.CopyToAsync(stream);

                libro.RutaArchivoPortada = $"/Portadas/{portadaName}";
            }


            if (string.IsNullOrEmpty(libro.RutaArchivoPDF) || string.IsNullOrEmpty(libro.RutaArchivoPortada))
            {
                return BadRequest("Faltan archivos requeridos.");
            }

            var nuevo = _service.Add(libro);

            return CreatedAtAction(nameof(Get), new { id = nuevo.idLibro }, nuevo);
        }



        [HttpPut("{id}")]
        public IActionResult Update(int id, Libros libro)
        {
            if (!_service.Update(id, libro)) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_service.Delete(id)) return NotFound();
            return NoContent();
        }
    }

}
