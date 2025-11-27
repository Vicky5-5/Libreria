using System.Threading.Tasks;
using System.Collections.Generic;

namespace BackEnd_Libreria.Models.Usuario
{
    public interface IUsuarioService
    {
        IEnumerable<Usuario> GetAll();
        IEnumerable<Usuario> GetAllActivos();
        Usuario? GetById(string id);
        Task<Usuario> Add(Usuario usuario, string password); // Así hacemos que el método sea asíncrono y coincida con el controlador
        bool Actualizar(string id, Usuario usuario);
        bool DarBaja(string id);
        bool DarAltaDeNuevo(string id);
    }

}
