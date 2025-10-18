using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BackEnd_Libreria.Models.Usuario
{
    public class Usuario: IdentityUser
    {
        [Key]
        public int idUsuario { get; set; }
         [Required]
        public string Nombre { get; set; }
        [Required]
        public  string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public DateTime? FechaBaja { get; set; }
        [Required]
        public bool Estado { get; set; } = true;
        [Required]
        public bool Admin { get; set; }
        public string Salt { get; set; } //Salt para el hash de la contraseña y que sea más seguro y para cada usuario sea diferente

    }
}
