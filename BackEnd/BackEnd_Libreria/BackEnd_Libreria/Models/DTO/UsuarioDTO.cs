using System.ComponentModel.DataAnnotations;

namespace BackEnd_Libreria.Models.DTO
{
    public class UsuarioDTO
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public DateTime FechaRegistro { get; set; }

        public DateTime? FechaBaja { get; set; }

        [Required]
        public bool Estado { get; set; } = true;

        [Required]
        public bool Admin { get; set; }

        public string? Salt { get; set; }
    }

}
