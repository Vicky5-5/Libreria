using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Identity;

namespace BackEnd_Libreria.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly UserManager<Usuario> _userManager;

        public UsuarioService(UserManager<Usuario> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await Task.FromResult(_userManager.Users.ToList());
        }

        public async Task<IEnumerable<Usuario>> GetAllActivosAsync()
        {
            return await Task.FromResult(_userManager.Users.Where(u => u.Estado).ToList());
        }

        public async Task<Usuario?> GetByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task<Usuario> AddAsync(Usuario usuario, string password)
        {
            usuario.FechaRegistro = DateTime.Now;
            usuario.Estado = true;
            usuario.FechaBaja = null;

            var result = await _userManager.CreateAsync(usuario, password);
            if (!result.Succeeded)
            {
                var errores = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al crear usuario: {errores}");
            }

            return usuario;
        }

        public async Task<bool> ActualizarAsync(string id, Usuario datos)
        {
            var usuario = await _userManager.FindByIdAsync(id);
            if (usuario == null) return false;

            usuario.Nombre = datos.Nombre;
            usuario.Admin = datos.Admin;
            usuario.Estado = datos.Estado;

            var result = await _userManager.UpdateAsync(usuario);
            return result.Succeeded;
        }

        public async Task<bool> DarBajaAsync(string id)
        {
            var usuario = await _userManager.FindByIdAsync(id);
            if (usuario == null) return false;

            usuario.Estado = false;
            usuario.FechaBaja = DateTime.Now;

            var result = await _userManager.UpdateAsync(usuario);
            return result.Succeeded;
        }

        public async Task<bool> DarAltaDeNuevoAsync(string id)
        {
            var usuario = await _userManager.FindByIdAsync(id);
            if (usuario == null || usuario.Estado) return false;

            usuario.Estado = true;
            usuario.FechaBaja = null;

            var result = await _userManager.UpdateAsync(usuario);
            return result.Succeeded;
        }
    }
}
