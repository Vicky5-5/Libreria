namespace BackEnd_Libreria.Hub;

using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

// Solo los usuarios con un JWT válido pueden conectarse a este hub
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatHub : Hub
{
    private readonly UserManager<Usuario> _userManager;

    // Diccionario estático compartido entre todas las instancias del hub.
    // Clave: userId (string) → Valor: connectionId (string)
    // ConcurrentDictionary porque múltiples usuarios pueden conectarse
    // al mismo tiempo y necesitamos evitar conflictos de acceso simultáneo.
    private static readonly ConcurrentDictionary<string, string> _usuariosConectados = new();

    // UserManager nos permite buscar usuarios en la base de datos por su ID
    public ChatHub(UserManager<Usuario> userManager)
    {
        _userManager = userManager;
    }

    // SignalR llama a este método automáticamente cada vez que
    // un cliente establece conexión con el hub
    public override async Task OnConnectedAsync()
    {
        // Context.UserIdentifier extrae el ID del usuario del JWT.
        // SignalR lo obtiene del claim NameIdentifier automáticamente.
        var userId = Context.UserIdentifier;

        if (userId != null)
        {
            // Guardamos la conexión. Si el usuario ya tenía una conexión anterior (por ejemplo, abrió otra pestaña), se sobreescribe
            // con la nueva. Context.ConnectionId es único por pestaña/sesión.
            _usuariosConectados[userId] = Context.ConnectionId;

            // Avisamos a TODOS los demás clientes conectados (no al que acaba de entrar) que este usuario ya está en línea.
            // Esto permite que Angular actualice el punto verde en tiempo real.
            await Clients.Others.SendAsync("UsuarioConectado", userId);
        }

        await base.OnConnectedAsync();
    }

    // SignalR llama a este método automáticamente cuando un cliente cierra el chat, cierra el navegador o pierde la conexión
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;

        if (userId != null)
        {
            // Eliminamos la entrada del diccionario. TryRemove es la forma segura de borrar en ConcurrentDictionary,
            // el segundo parámetro (out _) descarta el valor eliminado.
            _usuariosConectados.TryRemove(userId, out _);

            // Avisamos a los demás que este usuario ya no está en línea.
            // Angular recibirá el evento y apagará su punto verde.
            await Clients.Others.SendAsync("UsuarioDesconectado", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Angular invoca este método nada más conectarse para saber qué usuarios estaban ya conectados antes de que él llegara.
    // Devuelve una lista con los IDs de todos los usuarios activos.
    public Task<List<string>> ObtenerConectados()
    {
        // Keys devuelve todos los userIds que hay en el diccionario, es decir, todos los que tienen una conexión activa ahora mismo.
        return Task.FromResult(_usuariosConectados.Keys.ToList());
    }

    // Angular invoca este método cuando el usuario pulsa "Enviar".
    // Recibe el ID del destinatario y el texto del mensaje.
    public async Task EnviarMensajePrivado(string usuarioDestinoId, string mensaje)
    {
        // Obtenemos el ID del usuario que está enviando el mensaje desde los claims del JWT que vino en la conexión.
        var emisorId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        Console.WriteLine($">>> emisorId del JWT: '{emisorId}'");
        Console.WriteLine($">>> Todos los claims: {string.Join(", ", Context.User?.Claims.Select(c => $"{c.Type}={c.Value}") ?? [])}");

        if (string.IsNullOrEmpty(emisorId))
            throw new HubException("Usuario no autenticado");

        // Buscamos al emisor en la base de datos para obtener su nombre y poder mostrárselo al destinatario en la burbuja del chat.
        var emisor = await _userManager.FindByIdAsync(emisorId);
        if (emisor == null)
            throw new HubException("Usuario no encontrado");
        Console.WriteLine($">>> Usuario encontrado: {emisor?.Id ?? "NULL"}");

        // Construimos el objeto que recibirán tanto el destinatario como el propio emisor. Debe coincidir exactamente con la
        // interfaz MensajeChat que se tiene definida en Angular.
        var payload = new
        {
            emisorId,
            usuarioDestinoId,
            nombre = emisor.Nombre,
            mensaje,
            fecha = DateTime.UtcNow
        };

        // Buscamos si el destinatario está conectado en este momento.
        // Si cerró el chat o perdió conexión, su entrada no estará en el diccionario y el mensaje simplemente no se entrega
        // (aquí podrías guardar en BD para mensajes no leídos).
        if (_usuariosConectados.TryGetValue(usuarioDestinoId, out var connectionId))
        {
            // Clients.Client(connectionId) envía el mensaje SOLO a ese connectionId específico, nadie más lo ve.
            await Clients.Client(connectionId).SendAsync("RecibirMensaje", payload);
        }
        Console.WriteLine($">>> Destinatario buscado: '{usuarioDestinoId}'");
        Console.WriteLine($">>> Usuarios conectados: {string.Join(", ", _usuariosConectados.Keys)}");
        Console.WriteLine($">>> Destinatario encontrado: {_usuariosConectados.ContainsKey(usuarioDestinoId)}");
        // Enviamos también al propio emisor para que vea su mensaje aparecer en su pantalla sin necesidad de añadirlo manualmente en Angular.
        // Clients.Caller apunta siempre al que invocó el método.
        await Clients.Caller.SendAsync("RecibirMensaje", payload);
    }
}