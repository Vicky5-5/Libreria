namespace BackEnd_Libreria.Models.DTO
{
    public class EditarUsuarioDTO
    {
        public String Nombre { get; set; } 
        public String Email { get; set; }
        public bool Estado { get; set; }
        public bool Admin { get; set; }
    }
}
