namespace BackEnd_Libreria.Hub;

using BackEnd_Libreria.Contexto;
using BackEnd_Libreria.Models;
using BackEnd_Libreria.Models.Usuario;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Security.Claims;

// Solo los usuarios con un JWT válido pueden conectarse a este hub
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatHub : Hub
{
    private readonly UserManager<Usuario> _userManager;

    // Contexto de base de datos para guardar y recuperar mensajes
    private readonly Conexion _context;

    // Diccionario estático compartido entre todas las instancias del hub.
    // Clave: userId (string) → Valor: connectionId (string)
    // ConcurrentDictionary porque múltiples usuarios pueden conectarse
    // al mismo tiempo y necesitamos evitar conflictos de acceso simultáneo.
    // Solo se usa para el punto verde — saber quién está conectado ahora mismo
    private static readonly ConcurrentDictionary<string, string> _usuariosConectados = new();

    // UserManager nos permite buscar usuarios en la base de datos por su ID
    // Conexion es el DbContext para guardar y recuperar mensajes
    public ChatHub(UserManager<Usuario> userManager, Conexion context)
    {
        _userManager = userManager;
        _context = context;
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
            // Guardamos la conexión. Si el usuario ya tenía una conexión anterior
            // (por ejemplo, abrió otra pestaña), se sobreescribe con la nueva.
            // Context.ConnectionId es único por pestaña/sesión.
            _usuariosConectados[userId] = Context.ConnectionId;

            // Avisamos a TODOS los demás clientes conectados (no al que acaba de entrar)
            // que este usuario ya está en línea.
            // Esto permite que Angular actualice el punto verde en tiempo real.
            await Clients.Others.SendAsync("UsuarioConectado", userId);
        }

        await base.OnConnectedAsync();
    }

    // SignalR llama a este método automáticamente cuando un cliente
    // cierra el chat, cierra el navegador o pierde la conexión
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;

        if (userId != null)
        {
            // Eliminamos la entrada del diccionario.
            // TryRemove es la forma segura de borrar en ConcurrentDictionary,
            // el segundo parámetro (out _) descarta el valor eliminado.
            _usuariosConectados.TryRemove(userId, out _);

            // Avisamos a los demás que este usuario ya no está en línea.
            // Angular recibirá el evento y apagará su punto verde.
            await Clients.Others.SendAsync("UsuarioDesconectado", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Angular invoca este método nada más conectarse para saber
    // qué usuarios estaban ya conectados antes de que él llegara.
    // Devuelve una lista con los IDs de todos los usuarios activos.
    public Task<List<string>> ObtenerConectados()
    {
        // Keys devuelve todos los userIds que hay en el diccionario,
        // es decir, todos los que tienen una conexión activa ahora mismo.
        return Task.FromResult(_usuariosConectados.Keys.ToList());
    }

    // Angular invoca este método cuando el usuario pulsa "Enviar".
    // Recibe el ID del destinatario y el texto del mensaje.
    public async Task EnviarMensajePrivado(string usuarioDestinoId, string mensaje)
    {
        // Obtenemos el ID del usuario que está enviando el mensaje
        // desde los claims del JWT que vino en la conexión.
        var emisorId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(emisorId))
            throw new HubException("Usuario no autenticado");

        // Buscamos al emisor en la base de datos para obtener su nombre
        // y poder mostrárselo al destinatario en la burbuja del chat.
        var emisor = await _userManager.FindByIdAsync(emisorId);
        if (emisor == null)
            throw new HubException("Usuario no encontrado");

        // Guardamos el mensaje en BD siempre, esté o no conectado el destinatario.
        // Así el historial se mantiene aunque el usuario cierre sesión.
        var mensajeEntity = new MensajeChat
        {
            EmisorId = emisorId,
            DestinatarioId = usuarioDestinoId,
            Mensaje = mensaje,
            Fecha = DateTime.UtcNow,
            Leido = false
        };
        _context.MensajesChat.Add(mensajeEntity);
        await _context.SaveChangesAsync();

        // Construimos el objeto que recibirán tanto el destinatario como el propio emisor.
        // Debe coincidir exactamente con la interfaz MensajeChat que tienes definida en Angular.
        var payload = new
        {
            id = mensajeEntity.Id,
            emisorId,
            usuarioDestinoId,
            nombre = emisor.Nombre,
            mensaje,
            fecha = mensajeEntity.Fecha,
            leido = false
        };

        // Clients.User() usa el claim NameIdentifier del JWT internamente.
        // A diferencia de Clients.Client(), no necesita el connectionId manual.
        // Funciona aunque el destinatario no esté en _usuariosConectados.
        // Si está desconectado, el mensaje quedó en BD y lo verá al cargar el historial.
        await Clients.User(usuarioDestinoId).SendAsync("RecibirMensaje", payload);

        // Enviamos también al propio emisor para que vea su mensaje aparecer
        // en su pantalla sin necesidad de añadirlo manualmente en Angular.
        // Clients.Caller apunta siempre al que invocó el método.
        await Clients.Caller.SendAsync("RecibirMensaje", payload);
    }

    // Angular lo invoca al seleccionar un usuario para cargar la conversación completa.
    // Devuelve todos los mensajes entre el usuario actual y el seleccionado, en orden cronológico.
    public async Task<List<object>> ObtenerHistorial(string otroUsuarioId)
    {
        // Obtenemos el ID del usuario actual desde el JWT
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            throw new HubException("Usuario no autenticado");

        // Traemos todos los mensajes entre los dos usuarios en orden cronológico.
        // La condición OR cubre ambas direcciones: yo → él y él → yo.
        var mensajes = await _context.MensajesChat
            .Include(m => m.Emisor)
            .Where(m =>
                (m.EmisorId == userId && m.DestinatarioId == otroUsuarioId) ||
                (m.EmisorId == otroUsuarioId && m.DestinatarioId == userId))
            .OrderBy(m => m.Fecha)
            .Select(m => (object)new
            {
                id = m.Id,
                emisorId = m.EmisorId,
                usuarioDestinoId = m.DestinatarioId,
                nombre = m.Emisor.Nombre,
                mensaje = m.Mensaje,
                fecha = m.Fecha,
                leido = m.Leido
            })
            .ToListAsync();

        // Marcamos como leídos los mensajes que nos enviaron a nosotros
        // y que aún no habíamos visto. ExecuteUpdateAsync es más eficiente
        // que cargar las entidades y guardarlas una por una.
        await _context.MensajesChat
            .Where(m => m.DestinatarioId == userId &&
                        m.EmisorId == otroUsuarioId &&
                        !m.Leido)
            .ExecuteUpdateAsync(m => m.SetProperty(x => x.Leido, true));

        return mensajes;
    }
}