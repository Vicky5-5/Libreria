using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_Libreria.Models.Libros
{
    public class Libros
    {
        [Key]
        public int idLibro { get; set; }
        [NotMapped]
        public IFormFile Portada { get; set; }
        
        public string RutaArchivoPortada { get; set; }
        [Required]
        public string Titulo { get; set; }
        [Required]
        public string Autor { get; set; }
        [NotMapped]
        public IFormFile ArchivoPDF { get; set; }

        public string RutaArchivoPDF { get; set; }
        public int yearPublicacion { get; set; }
        public Genero Genero { get; set; }
        public bool Favorito { get; set; }
        public string Idioma { get; set; }
        public string Sinopsis { get; set; }
        public bool Disponibilidad { get; set; }
        
    }
    public enum Genero
    {
        [DescriptionAttribute("Terror")]
        Terror,

        [DescriptionAttribute("Comedia")]
        Comedia,

        [DescriptionAttribute("Romance")]
        Romance,
        [DescriptionAttribute("Acción")]
        Acción
    }
}
