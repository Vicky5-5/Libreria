using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BackEnd_Libreria.Models.Usuario
{
    //El identity ya usa de por si el Id, Email, hashContraseña, nombre de usuario
    public class Usuario : IdentityUser
    {
        [Required]
        public string Nombre { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        public DateTime? FechaBaja { get; set; }

        [Required]
        public bool Estado { get; set; } = true;

        [Required]
        public bool Admin { get; set; }

        public string? Salt { get; set; }
    }

}
