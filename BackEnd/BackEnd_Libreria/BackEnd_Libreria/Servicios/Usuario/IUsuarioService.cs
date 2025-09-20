namespace BackEnd_Libreria.Models.Usuario
{
    public interface IUsuarioService
    {
        IEnumerable<Usuario> GetAll();
        Usuario? GetById(int id);
        Usuario Add(Usuario usuario);
        bool Actualizar(int id, Usuario usuario);
        bool DarBaja(int id);
        bool DarAltaDeNuevo(int id);
    }
}
