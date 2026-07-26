using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.ChatGrupal;

namespace BackEnd_Libreria.Hub
{
    public class GrupoChat
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public string? Descripcion { get; set; }

        public ICollection<ChatGrupoUsuario> Usuarios { get; set; }
        public ICollection<MensajeGrupo> Mensajes { get; set; } = new List<MensajeGrupo>();

    }
}
