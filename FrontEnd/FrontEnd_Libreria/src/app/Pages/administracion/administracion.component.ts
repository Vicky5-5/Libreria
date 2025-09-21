import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Libros, Genero } from '../../Models/libros/libros.model';
import { LibrosService } from '../../Servicios/libros.service';
import { responseAPILibro } from '../../Models/responseAPILibro';


@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent {
  private librosService = inject(LibrosService);
  private router = inject(Router);

  public listaLibros: Libros[] = [];
  public displayedColumns: string[] = ['titulo', 'autor', 'genero', 'yearPublicacion', 'accion'];

  constructor() {
    this.obtenerLibros(); // Carga inicial
  }

  obtenerLibros() {
  this.librosService.listar().subscribe({
    next: (response: responseAPILibro<Libros[]>) => {
      if (response.isSuccess) {
        this.listaLibros = response.data;
      } else {
        console.warn('La respuesta no fue exitosa:', response.message);
      }
    },
    error: (err: any) => {
      console.error('Error al cargar libros:', err.message);
    }
  });
}


  crearLibro() {
    this.router.navigate(['/libros', 0]); // Navega al formulario para crear libro
  }

  editar(libro: Libros) {
    this.router.navigate(['/libros', libro.idLibro]); // Navega al formulario con el id del libro
  }

  eliminar(libro: Libros) {
    if (confirm(`¿Desea eliminar el libro "${libro.titulo}"?`)) {
      this.librosService.borrar(libro.idLibro).subscribe({
        next: (data: any) => {
          if (data.isSuccess) {
            this.obtenerLibros();
          } else {
            alert('No se pudo eliminar el libro');
          }
        },
        error: (err: any) => {
          console.error('Error al eliminar libro:', err.message);
          alert('No se pudo eliminar el libro');
        }
      });
    }
  }
}
