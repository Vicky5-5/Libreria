namespace BackEnd_Libreria.Hub;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Authorization;

[Authorize]
    public class ChatHub : Hub
    {
    private readonly UserManager<Usuario> _userManager;

    public ChatHub(UserManager<Usuario> userManager)
    {
        _userManager = userManager;
    }

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

    // Para chat grupales. Se hace más adelante cuando se implemente la funcionalidad de una conversación entre dos usuarios.
    public async Task UnirseGrupo() { }

}

