namespace BackEnd_Libreria.Models.Usuario
{
    public class Usuario
    {
        public int idUsuario { get; set; }
        public string Nombre { get; set; }
        public  string Email { get; set; }
        public string Password { get; set; }
        public bool Estado { get; set; }
        public bool Admin { get; set; }

    }
}
