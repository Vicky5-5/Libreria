using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace BackEnd_Libreria.Models
{
    public class UserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
