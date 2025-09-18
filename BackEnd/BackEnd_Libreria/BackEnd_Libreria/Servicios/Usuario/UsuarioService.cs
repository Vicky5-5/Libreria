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
            _usuarios.Add(usuario);
            return usuario;
        }

        public bool Update(int id, Usuario usuario)
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

        public bool Delete(int id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.idUsuario == id);
            if (usuario == null) return false;

            _usuarios.Remove(usuario);
            return true;
        }
    }
}
