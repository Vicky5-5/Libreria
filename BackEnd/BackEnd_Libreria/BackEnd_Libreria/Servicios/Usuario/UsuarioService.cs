using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_Libreria.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly Conexion _context;

        public UsuarioService(Conexion context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Users.ToList();
        }

        public IEnumerable<Usuario> GetAllActivos()
        {
            return _context.Users.Where(u => u.Estado).ToList();
        }

        public Usuario? GetById(string id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public Usuario Add(Usuario usuario, string password)
        {
            usuario.FechaRegistro = DateTime.Now;
            usuario.Estado = true;
            usuario.FechaBaja = null;

            var result = _userManager.CreateAsync(usuario, password).Result;
            if (!result.Succeeded)
            {
                var errores = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al crear usuario: {errores}");
            }

            return usuario;
        }

        public bool Actualizar(string id, Usuario datos)
        {
            var usuario = _context.Users.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return false;

            usuario.Nombre = datos.Nombre;
            usuario.Admin = datos.Admin;
            usuario.Estado = datos.Estado;

            var result = _userManager.UpdateAsync(usuario).Result;
            return result.Succeeded;
        }

        public bool DarBaja(string id)
        {
            var usuario = _userManager.Users.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return false;

            usuario.Estado = false;
            usuario.FechaBaja = DateTime.Now;

            var result = _userManager.UpdateAsync(usuario).Result;
            return result.Succeeded;
        }

        public bool DarAltaDeNuevo(string id)
        {
            var usuario = _userManager.Users.FirstOrDefault(u => u.Id == id);
            if (usuario == null || usuario.Estado) return false;

            usuario.Estado = true;
            usuario.FechaBaja = null;

            var result = _userManager.UpdateAsync(usuario).Result;
            return result.Succeeded;
        }
    }
}
