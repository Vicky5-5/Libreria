using Microsoft.AspNetCore.Mvc;
using BackEnd_Libreria.Models.Libros;
namespace BackEnd_Libreria.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LibrosController : ControllerBase

    {
        private readonly ILibrosService _service;

        public LibrosController(ILibrosService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Libros>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Libros> Get(int id)
        {
            var libro = _service.GetById(id);
            if (libro == null) return NotFound();
            return Ok(libro);
        }

        [HttpPost]
        public ActionResult<Libros> Create([FromForm] Libros libro)
        {
            // Guardar portada y archivo PDF
            if (libro.ArchivoPDF != null)
            {
                var filePath = Path.Combine("wwwroot/pdfs", libro.ArchivoPDF.FileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                libro.ArchivoPDF.CopyTo(stream);

                libro.RutaArchivoPDF = $"/pdfs/{libro.ArchivoPDF.FileName}";
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
