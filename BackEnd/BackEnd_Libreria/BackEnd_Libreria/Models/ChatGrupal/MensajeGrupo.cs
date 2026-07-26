using UsuarioModel = BackEnd_Libreria.Models.Usuario.Usuario;

namespace BackEnd_Libreria.Models.ChatGrupal
{
    public class MensajeGrupo
    {
        public Guid Id { get; set; }

        public Guid ChatGrupoId { get; set; }
        public ChatGrupo ChatGrupo { get; set; } = null!;

        public string EmisorId { get; set; } = string.Empty;
        public UsuarioModel Emisor { get; set; } = null!;

        public string Mensaje { get; set; } = string.Empty;

        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public bool Eliminado { get; set; } = false;
        public bool Editado { get; set; } = false;
    }
}
