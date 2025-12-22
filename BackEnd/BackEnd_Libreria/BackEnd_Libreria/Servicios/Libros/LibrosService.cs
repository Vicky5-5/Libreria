using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models.DTO;
using BackEnd_Libreria.Models.Libros;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_Libreria.Services
{
    public class LibrosService : ILibrosService
    {
        private readonly Conexion _context;

        public LibrosService(Conexion context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Libros>> GetAll()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libros?> GetById(Guid id)
        {
            return await _context.Libros.FirstOrDefaultAsync(l => l.idLibro == id);
        }

        public async Task<Libros> Add(CrearLibroDTO dto)
        {
            var libro = new Libros
            {
                idLibro = Guid.NewGuid(),
                Titulo = dto.Titulo,
                Autor = dto.Autor,
                yearPublicacion = dto.yearPublicacion,
                Genero = dto.Genero,
                Idioma = dto.Idioma,
                Sinopsis = dto.Sinopsis,
                Disponibilidad = dto.Disponibilidad,
            };

            // Guardar PDF si viene
            if (dto.ArchivoPDF != null)
            {
                var pdfName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ArchivoPDF.FileName)}";
                var pdfFolder = Path.Combine(Directory.GetCurrentDirectory(), "pdfs");
                Directory.CreateDirectory(pdfFolder);

                var pdfPath = Path.Combine(pdfFolder, pdfName);
                using (var stream = new FileStream(pdfPath, FileMode.Create))
                {
                    await dto.ArchivoPDF.CopyToAsync(stream);
                }

                libro.RutaArchivoPDF = $"/pdfs/{pdfName}";
            }

            // Guardar portada si viene
            if (dto.Portada != null)
            {
                var portadaName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Portada.FileName)}";
                var portadaFolder = Path.Combine(Directory.GetCurrentDirectory(), "Portadas");
                Directory.CreateDirectory(portadaFolder);

                var portadaPath = Path.Combine(portadaFolder, portadaName);
                using (var stream = new FileStream(portadaPath, FileMode.Create))
                {
                    await dto.Portada.CopyToAsync(stream);
                }

                libro.RutaArchivoPortada = $"/Portadas/{portadaName}";
            }

            await _context.Libros.AddAsync(libro);
            await _context.SaveChangesAsync();

            return libro;
        }

        public async Task<Libros?> Actualizar(Guid id, EditarLibroDTO dto)
        {
            var existing = await _context.Libros.FirstOrDefaultAsync(l => l.idLibro == id);
            if (existing == null) return null;

            // Actualizar campos desde DTO
            existing.Titulo = dto.Titulo;
            existing.Autor = dto.Autor;
            existing.yearPublicacion = dto.YearPublicacion;
            existing.Genero = dto.Genero;
            existing.Idioma = dto.Idioma;
            existing.Sinopsis = dto.Sinopsis;
            existing.Disponibilidad = dto.Disponibilidad;

            // Actualizar rutas solo si vienen nuevas
            if (!string.IsNullOrEmpty(dto.RutaArchivoPDF))
                existing.RutaArchivoPDF = dto.RutaArchivoPDF;

            if (!string.IsNullOrEmpty(dto.RutaArchivoPortada))
                existing.RutaArchivoPortada = dto.RutaArchivoPortada;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(Guid id)
        {
            var libro = await _context.Libros.FirstOrDefaultAsync(l => l.idLibro == id);
            if (libro == null) return false;

            _context.Libros.Remove(libro);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}