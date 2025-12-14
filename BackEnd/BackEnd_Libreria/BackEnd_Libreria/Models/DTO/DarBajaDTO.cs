namespace BackEnd_Libreria.Models.DTO
{
    public class DarBajaDTO
    {
        public bool Estado { get; set; } = false;
        public DateTime FechaBaja { get; set; } = DateTime.UtcNow;
    }
}
