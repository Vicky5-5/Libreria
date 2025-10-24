namespace BackEnd_Libreria.Models.DTO
{
    public class LibrosDTO
    {
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int yearPublicacion { get; set; }
        public int Genero { get; set; }
        public string Idioma { get; set; }
        public string Sinopsis { get; set; }
        public bool Disponibilidad { get; set; }
        public bool Favorito { get; set; }
        public IFormFile ArchivoPDF { get; set; }
        public IFormFile Portada { get; set; }
    }
}
