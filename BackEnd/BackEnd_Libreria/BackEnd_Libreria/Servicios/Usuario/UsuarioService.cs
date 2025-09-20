using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.Usuario;

namespace BackEnd_Libreria.Services
{
    public class UsuarioService : IUsuarioService
    {
        private static List<Usuario> _usuarios = new List<Usuario>();

        public IEnumerable<Usuario> GetAll() => _usuarios;

        public Usuario? GetById(int id) => _usuarios.FirstOrDefault(u => u.idUsuario == id);

        public Usuario Add(Usuario usuario)
        {
            usuario.idUsuario = _usuarios.Count > 0 ? _usuarios.Max(u => u.idUsuario) + 1 : 1;
            usuario.FechaRegistro = DateTime.Now;
            usuario.Estado = true;
            usuario.FechaBaja = null;
            _usuarios.Add(usuario);
            return usuario;
        }


        public bool Actualizar(int id, Usuario usuario)
        {
            var existing = _usuarios.FirstOrDefault(u => u.idUsuario == id);
            if (existing == null) return false;

            existing.Nombre = usuario.Nombre;
            existing.Email = usuario.Email;
            existing.Password = usuario.Password;
            existing.Estado = usuario.Estado;
            existing.Admin = usuario.Admin;

            return true;
        }

        public bool DarBaja(int id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.idUsuario == id);
            if (usuario == null) return false;

            usuario.Estado = false;
            usuario.FechaBaja = DateTime.Now;
            return true;
        }
        public bool DarAltaDeNuevo(int id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.idUsuario == id);
            if (usuario == null || usuario.Estado) return false;

            usuario.Estado = true;
            usuario.FechaBaja = null;
            return true;
        }
        // Para obtener solo los usuarios activos
        public IEnumerable<Usuario> GetAllActivos() => _usuarios.Where(u => u.Estado);


    }
}
