using System.ComponentModel.DataAnnotations;

namespace BackEnd_Libreria.Models.DTO
{
    public class EditarUsuarioDTO
    {
        public String Nombre { get; set; } 
        public String Email { get; set; }

        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "Las contraseñas no coinciden")]
        public string? ConfirmPassword { get; set; }
        public bool Estado { get; set; }
        public bool Admin { get; set; }
    }
}
