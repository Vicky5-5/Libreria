namespace BackEnd_Libreria.Models.Usuario
{
    public interface IUsuarioService
    {
        IEnumerable<Usuario> GetAll();
        Usuario? GetById(int id);
        Usuario Add(Usuario usuario);
        bool Update(int id, Usuario usuario);
        bool Delete(int id);
    }
}
