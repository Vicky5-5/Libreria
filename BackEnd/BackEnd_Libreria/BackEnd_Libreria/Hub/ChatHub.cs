namespace BackEnd_Libreria.Hub;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

[Authorize]
    public class ChatHub : Hub
    {
    private readonly UserManager<Usuario> _userManager;

    public ChatHub(UserManager<Usuario> userManager)
    {
        _userManager = userManager;
    }
    // Mapeamos las conexiones de los usuarios
    private static readonly ConcurrentDictionary<string, HashSet<string>> _connections =
    new ConcurrentDictionary<string, HashSet<string>>();

    // Para ver si está conectado el usuario
    public override Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            var connections = _connections.GetOrAdd(userId, _ => new HashSet<string>());
            lock (connections)
            {
                connections.Add(Context.ConnectionId);
            }
        }

        return base.OnConnectedAsync();
    }

    // Para eliminar la conexión del usuario cuando se desconecta

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId) && _connections.TryGetValue(userId, out var connections))
        {
            lock (connections)
            {
                connections.Remove(Context.ConnectionId);
                if (connections.Count == 0)
                {
                    _connections.TryRemove(userId, out _);
                }
            }
        }
        return base.OnDisconnectedAsync(exception);
    }
    //public bool AddUserToList(string userId)
    //{
    //    lock (_userManager) { 
    //    foreach (var connection in _userManager.Users)
    //    {
    //        if (connection.Id == userId)
    //        {
    //            // Aquí podrías agregar lógica para mantener una lista de usuarios conectados
    //            // Por ejemplo, podrías usar un diccionario para mapear userId a Context.ConnectionId
    //            return true; // Usuario encontrado y agregado a la lista
    //            }
    //        }
    //    _userManager.Users.Add(new Usuario { Id = userId }); // Agregar el usuario a la lista
    //    }
    //    return true;
    //}

    // Método para enviar un mensaje a todos los clientes conectados/grupal
    public async Task EnviarMensaje(string mensaje)
    {
        // Obtener el ID del usuario desde el contexto
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            throw new HubException("Usuario no autenticado");

        var usuario = await _userManager.FindByIdAsync(userId);

        await Clients.All.SendAsync("RecibirMensaje", new
        {
            userId = usuario.Id,
            nombre = usuario.Nombre,
            mensaje,
            fecha = DateTime.UtcNow
        });
    }

    // Método para enviar un mensaje privado a un usuario específico
    public async Task EnviarMensajePrivado(string destinatarioID, string mensaje)
    {
        if (_connections.TryGetValue(destinatarioID, out var connections))
        {
            foreach (var connectionId in connections)
            {
                await Clients.Client(connectionId).SendAsync("RecibirMensajePrivado", new
                {
                    userId = Context.UserIdentifier,
                    mensaje,
                    fecha = DateTime.UtcNow
                });
            }
        }
    }

    // Para chat grupales. Se hace más adelante cuando se implemente la funcionalidad de una conversación entre dos usuarios.
    public async Task UnirseGrupo() { }

}

