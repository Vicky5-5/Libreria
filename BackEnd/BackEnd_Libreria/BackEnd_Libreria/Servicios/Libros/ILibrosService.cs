using BackEnd_Libreria.Models.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_Libreria.Models.Libros
{
    public interface ILibrosService
    {
        Task<IEnumerable<Libros>> GetAll();
        Task<Libros?> GetById(Guid id);
        Task<Libros> Add(CrearLibroDTO libro);
        Task<Libros> Actualizar(Guid id, EditarLibroDTO libro);
        Task<Libros> LibroNoDisponible(Guid id, bool disponibilidad);
        Task<Libros> LibroDisponible(Guid id, bool disponibilidad);
        Task<bool> Delete(Guid id);
    }
}
