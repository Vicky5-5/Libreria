using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.Libros;

namespace BackEnd_Libreria.Services
{
    public class LibrosService : ILibrosService
    {
        private static List<Libros> _libros = new List<Libros>();

        public IEnumerable<Libros> GetAll() => _libros;

        public Libros? GetById(int id) => _libros.FirstOrDefault(l => l.idLibro == id);

        public Libros Add(Libros libro)
        {
            libro.idLibro = _libros.Count > 0 ? _libros.Max(l => l.idLibro) + 1 : 1;
            _libros.Add(libro);
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
            existing.Estado = libros.Estado;
            existing.RutaArchivoPortada = libros.RutaArchivoPortada;


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

