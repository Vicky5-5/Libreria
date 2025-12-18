namespace BackEnd_Libreria.Models.DTO
{
    public class CrearLibroDTO
    {
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int yearPublicacion { get; set; }
        public Genero Genero { get; set; }
        public string Idioma { get; set; }
        public string Sinopsis { get; set; }
        public bool Disponibilidad { get; set; }

        public IFormFile ArchivoPDF { get; set; }
        public IFormFile Portada { get; set; }
    }
}
