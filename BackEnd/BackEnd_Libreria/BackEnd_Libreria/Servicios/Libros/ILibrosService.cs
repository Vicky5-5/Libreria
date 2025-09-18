namespace BackEnd_Libreria.Models.Libros
{
    public interface ILibrosService
    {
        IEnumerable<Libros> GetAll();
        Libros? GetById(int id);
        Libros Add(Libros libro);
        bool Update(int id, Libros libro);
        bool Delete(int id);
    }
}
