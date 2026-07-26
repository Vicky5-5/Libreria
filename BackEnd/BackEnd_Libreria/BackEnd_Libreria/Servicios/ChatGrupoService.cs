using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Hub;
using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.ChatGrupal;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace BackEnd_Libreria.Servicios
{
    public class ChatGrupoService
    {
        private readonly Conexion _context;

        public ChatGrupoService(Conexion context)
        {
            _context = context;
        }
        public async Task<List<ChatGrupo>> ObtenerGruposUsuario(string usuarioId)
        {
            return await _context.ChatGrupoUsuarios
                .Where(x => x.UsuarioId == usuarioId)
                .Select(x => x.Grupo)
                .ToListAsync();
        }
        public async Task<MensajeGrupo> GuardarMensaje(Guid grupoId, string usuarioId, string mensaje)
        {
            var nuevo = new MensajeGrupo
            {
                ChatGrupoId = grupoId,
                EmisorId = usuarioId,
                Mensaje = mensaje
            };

            _context.MensajesGrupo.Add(nuevo);

            await _context.SaveChangesAsync();

            return nuevo;
        }
        public async Task<List<MensajeGrupo>> ObtenerHistorial(Guid grupoId)
        {
            return await _context.MensajesGrupo
                .Include(x => x.Emisor)
                .Where(x => x.ChatGrupoId == grupoId)
                .OrderBy(x => x.Fecha)
                .ToListAsync();
        }
        public async Task<bool> PerteneceAlGrupo(Guid grupoId, string usuarioId)
        {
            return await _context.ChatGrupoUsuarios
                .AnyAsync(x =>
                    x.GrupoId == grupoId &&
                    x.UsuarioId == usuarioId);
        }
        public async Task<Guid> CrearGrupo(string nombre, string creadorId)
        {
            if (string.IsNullOrWhiteSpace(nombre) || nombre.Length < 3 || nombre.Length > 50)
            {
                throw new ArgumentException("El nombre del grupo debe tener entre 3 y 50 caracteres.");
            }
            var grupo = new ChatGrupo
            {
                Id = Guid.NewGuid(),
                Nombre = nombre,
                CreadorId = creadorId
            };

            _context.ChatGrupos.Add(grupo);

            _context.ChatGrupoUsuarios.Add(new ChatGrupoUsuario
            {
                GrupoId = grupo.Id,
                UsuarioId = creadorId,
                Admin = true
            });

            await _context.SaveChangesAsync();

            return grupo.Id;
        }
        public async Task<bool> AgregarUsuarioAGrupo(Guid grupoId, string usuarioId, bool esAdmin)
        {
            if (await PerteneceAlGrupo(grupoId, usuarioId))
            {
                return false; // El usuario ya pertenece al grupo
            }
            // Usando el Identity, para llamar a la tabla de Usuario hay que pner Users
            var usuarioExistente = await _context.Users.AnyAsync(u => u.Id == usuarioId);
            if (!usuarioExistente)
            {
                return false; // El usuario no existe
            }

            var chatGrupoUsuario = new ChatGrupoUsuario
            {
                GrupoId = grupoId,
                UsuarioId = usuarioId,
                Admin = esAdmin
            };
            _context.ChatGrupoUsuarios.Add(chatGrupoUsuario);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> EliminarUsuarioDeGrupo(Guid grupoId, string usuarioId)
        {
            var chatGrupoUsuario = await _context.ChatGrupoUsuarios
                .FirstOrDefaultAsync(x => x.GrupoId == grupoId && x.UsuarioId == usuarioId);
            if (chatGrupoUsuario == null)
            {
                return false; // El usuario no pertenece al grupo
            }
            _context.ChatGrupoUsuarios.Remove(chatGrupoUsuario);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> EliminarGrupo(Guid grupoId, string usuarioId)
        {
            var grupo = await _context.ChatGrupos
                .Include(g => g.Usuarios)
                .FirstOrDefaultAsync(g => g.Id == grupoId);
            if (grupo == null)
            {
                return false; // El grupo no existe
            }
            if (grupo.CreadorId != usuarioId)
            {
                return false; // Solo el creador puede eliminar el grupo
            }
            _context.ChatGrupos.Remove(grupo);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> EditarNombreGrupo(Guid grupoId, string usuarioId, string nuevoNombre)
        {
            if (string.IsNullOrWhiteSpace(nuevoNombre) || nuevoNombre.Length < 3 || nuevoNombre.Length > 50)
            {
                throw new ArgumentException("El nombre del grupo debe tener entre 3 y 50 caracteres.");
            }
            var grupo = await _context.ChatGrupos
                .FirstOrDefaultAsync(g => g.Id == grupoId);
            if (grupo == null)
            {
                return false; // El grupo no existe
            }
            if (grupo.CreadorId != usuarioId)
            {
                return false; // Solo el creador puede editar el nombre del grupo
            }
            grupo.Nombre = nuevoNombre;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<string> EditarMensaje(Guid mensajeId, string usuarioId, string nuevoMensaje)
        {
            if (string.IsNullOrWhiteSpace(nuevoMensaje) || nuevoMensaje.Length < 1 || nuevoMensaje.Length > 200)
            {
                throw new ArgumentException("El mensaje debe tener entre 1 y 200 caracteres.");
            }
            var mensaje = await _context.MensajesGrupo
                .FirstOrDefaultAsync(m => m.Id == mensajeId);
            if (mensaje == null)
            {
                throw new ArgumentException("El mensaje no existe.");
            }
            if (mensaje.EmisorId != usuarioId)
            {
                throw new ArgumentException("Solo el emisor del mensaje puede editarlo.");
            }
            mensaje.Mensaje = nuevoMensaje;
            mensaje.Editado = true;
            await _context.SaveChangesAsync();
            return nuevoMensaje;
        }
    }
}
