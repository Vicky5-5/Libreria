using BackEnd_Libreria.Models.Usuario;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UsuarioModel = BackEnd_Libreria.Models.Usuario.Usuario;

namespace BackEnd_Libreria.Models
{
    public class MensajeChat
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // ID único generado automáticamente

        // ID del usuario que envía el mensaje (GUID de Identity)
        [Required]
        public string EmisorId { get; set; } = null!;

        // ID del usuario que recibe el mensaje (GUID de Identity)
        [Required]
        public string DestinatarioId { get; set; } = null!;

        // Contenido del mensaje
        [Required]
        [MaxLength(2000)]
        public string Mensaje { get; set; } = null!;

        // Fecha de envío en UTC
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        // Para saber si el destinatario ya leyó el mensaje
        public bool Leido { get; set; } = false;

        // Navegación → usuario que envía
        [ForeignKey(nameof(EmisorId))]
        public UsuarioModel Emisor { get; set; } = null!;

        // Navegación → usuario que recibe
        [ForeignKey(nameof(DestinatarioId))]
        public UsuarioModel Destinatario { get; set; } = null!;
    }
}