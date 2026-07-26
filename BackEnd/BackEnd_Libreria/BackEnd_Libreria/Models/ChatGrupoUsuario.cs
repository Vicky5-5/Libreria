using BackEnd_Libreria.Models.ChatGrupal;
using UsuarioModel = BackEnd_Libreria.Models.Usuario.Usuario;
namespace BackEnd_Libreria.Models
{
    public class ChatGrupoUsuario
    {
        public Guid GrupoId { get; set; }
        public ChatGrupo Grupo { get; set; } = null!;

        public string UsuarioId { get; set; } = string.Empty;
        public UsuarioModel Usuario { get; set; } = null!; // Cambiado a UsuarioModel para evitar conflicto de nombres

        public bool Admin { get; set; }
        public DateTime FechaIngreso { get; set; } = DateTime.UtcNow;
        public bool Activo { get; set; } = true;
    
        public DateTime? FechaSalida { get; set; }

    }
}
