using System.ComponentModel;

namespace BackEnd_Libreria.Models.DTO
{
    public class LibroDetalleDTO
    {
        public Guid IdLibro { get; set; }
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int yearPublicacion { get; set; }
        public Genero Genero { get; set; }
        public string Idioma { get; set; }
        public string Sinopsis { get; set; }
        public bool Disponibilidad { get; set; }
        public bool Favorito { get; set; }
        public string RutaArchivoPDF { get; set; }
        public string RutaArchivoPortada { get; set; }
    }
   
}
