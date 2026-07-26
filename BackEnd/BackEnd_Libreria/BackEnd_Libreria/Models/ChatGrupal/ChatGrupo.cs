using UsuarioModel = BackEnd_Libreria.Models.Usuario.Usuario;

namespace BackEnd_Libreria.Models.ChatGrupal
{
    public class ChatGrupo
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string CreadorId { get; set; } = string.Empty;
        public UsuarioModel Creador { get; set; } = null!;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public ICollection<ChatGrupoUsuario> Usuarios { get; set; } = new List<ChatGrupoUsuario>();
        public ICollection<MensajeGrupo> Mensajes { get; set; } = new List<MensajeGrupo>();
    }
}
