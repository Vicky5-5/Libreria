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
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int yearPublicacion { get; set; }
        public Genero Genero { get; set; }
        public bool Favorito { get; set; }
        public bool Estado { get; set; }
        
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
