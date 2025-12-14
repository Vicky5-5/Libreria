using System.Threading.Tasks;
using System.Collections.Generic;
using BackEnd_Libreria.Models.DTO;

namespace BackEnd_Libreria.Models.Usuario
{
    public interface IUsuarioService
    {
        IEnumerable<Usuario> GetAll();
        IEnumerable<Usuario> GetAllActivos();
        Usuario? GetById(string id);
        Task<Usuario> Add(Usuario usuario, string password); // Así hacemos que el método sea asíncrono y coincida con el controlador
        Task <Usuario> Actualizar(string Id, EditarUsuarioDTO usuario);
        Task <bool> DarBajaUsuario(string id);
        Task <bool> DarAltaUsuario(string id);
    }

}
