using System.ComponentModel.DataAnnotations;

namespace BackEnd_Libreria.Models.DTO
{
    public class CrearUsuarioDTO
    {
        [Required]
        public string Nombre { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public bool Admin { get; set; }

        public bool Estado { get; set; } = true;

    }
}
