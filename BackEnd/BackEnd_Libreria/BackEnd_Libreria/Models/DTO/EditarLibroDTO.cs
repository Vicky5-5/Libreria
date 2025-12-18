using System.ComponentModel;

namespace BackEnd_Libreria.Models.DTO
{
    public class EditarLibroDTO
    {
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int YearPublicacion { get; set; }
        public Genero Genero{ get; set; }
        public string Idioma { get; set; }
        public string Sinopsis { get; set; }
        public bool Disponibilidad { get; set; }
        public IFormFile? ArchivoPDF { get; set; }
        public string? RutaArchivoPDF { get; set; }

        public IFormFile? Portada { get; set; }
        public string? RutaArchivoPortada { get; set; }
    }
  
}
