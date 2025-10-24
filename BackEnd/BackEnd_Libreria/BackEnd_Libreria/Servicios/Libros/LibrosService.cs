using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.Libros;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_Libreria.Services
{
    public class LibrosService : ILibrosService
    {
        private static List<Libros> _libros = new List<Libros>();
        private readonly Conexion _context;
        public LibrosService(Conexion context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IEnumerable<Libros> GetAll() => _context.Libros.ToList();

        public Libros? GetById(int id) => _context.Libros.FirstOrDefault(l => l.idLibro == id);


        public Libros Add(Libros libro)
        {
            _context.Libros.Add(libro);
            _context.SaveChanges();     
            return libro;
        }


        public bool Update(int id, Libros libros)
        {
            var existing = _libros.FirstOrDefault(l => l.idLibro == id);
            if (existing == null) return false;

            existing.Titulo = libros.Titulo;
            existing.Autor = libros.Autor;
            existing.yearPublicacion = libros.yearPublicacion;
            existing.Genero = libros.Genero;
            existing.Favorito = libros.Favorito;
            existing.RutaArchivoPDF = libros.RutaArchivoPDF;
            existing.RutaArchivoPortada = libros.RutaArchivoPortada;
            existing.Idioma = libros.Idioma;
            existing.Sinopsis = libros.Sinopsis;
            existing.Disponibilidad = libros.Disponibilidad;
            existing.Favorito = libros.Favorito;
            return true;
        }

        public bool Delete(int id)
        {
            var libro = _libros.FirstOrDefault(u => u.idLibro == id);
            if (libro == null) return false;

            _libros.Remove(libro);
            return true;
        }
    }
}

