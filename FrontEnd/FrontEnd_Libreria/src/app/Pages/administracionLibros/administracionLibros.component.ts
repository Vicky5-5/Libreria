import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Libros, Genero } from '../../interface/Libros';
import { LibrosService } from '../../Servicios/libros.service';
import { responseAPILibro } from '../../Models/responseAPILibro';
import { MatIcon } from "@angular/material/icon";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-administracionLibros',
  standalone: true,
  imports: [CommonModule, MatIcon, MatPaginatorModule, MatSortModule,MatTableModule,MatCardModule],
  templateUrl: './administracionLibros.component.html',
  styleUrls: ['./administracionLibros.component.css']
})
export class AdministracionLibrosComponent {
  private librosService = inject(LibrosService);
  private router = inject(Router);

  public listaLibros = new MatTableDataSource<Libros>();
  public displayedColumns: string[] = [
    'titulo', 'autor', 'genero', 'yearPublicacion', 'favorito', 'idioma', 'sinopsis', 'accion'
  ];

  constructor() {
    this.obtenerLibros(); // Carga inicial
  }

  obtenerLibros() {
    this.librosService.listar().subscribe({
      next: (response: responseAPILibro<Libros[]>) => {
        if (response.isSuccess) {
          this.listaLibros.data = response.data;
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
    this.router.navigate(['/libros', 0]);
  }

  editar(libro: Libros) {
    this.router.navigate(['/libros', libro.idLibro]);
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
