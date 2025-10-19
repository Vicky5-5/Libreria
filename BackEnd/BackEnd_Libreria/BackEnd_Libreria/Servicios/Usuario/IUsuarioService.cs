using System.Threading.Tasks;
using System.Collections.Generic;

namespace BackEnd_Libreria.Models.Usuario
{
    public interface IUsuarioService
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<IEnumerable<Usuario>> GetAllActivosAsync();
        Task<Usuario?> GetByIdAsync(string id);
        Task<Usuario> AddAsync(Usuario usuario, string password);
        Task<bool> ActualizarAsync(string id, Usuario usuario);
        Task<bool> DarBajaAsync(string id);
        Task<bool> DarAltaDeNuevoAsync(string id);
    }
}
