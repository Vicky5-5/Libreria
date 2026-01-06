namespace BackEnd_Libreria.Hub;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using BackEnd_Libreria.Models.Usuario;

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
        var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new HubException("No autenticado");

        var usuario = await _userManager.FindByIdAsync(userId);

        await Clients.All.SendAsync("RecibirMensaje", new
        {
            userId = usuario.Id,
            nombre = usuario.Nombre,
            mensaje = mensaje,
            fecha = DateTime.Now
        });
    }

    // Para chat grupales. Se hace más adelante cuando se implemente la funcionalidad de una conversación entre dos usuarios.
    public async Task UnirseGrupo() { }

}

