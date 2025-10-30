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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { NuevoLibroComponent } from './nuevoLibro/nuevoLibro.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-administracionLibros',
  standalone: true,
  imports: [CommonModule, MatIcon, MatPaginatorModule, MatSortModule,MatTableModule,MatCardModule, MatButtonModule,MatDialogModule],
  templateUrl: './administracionLibros.component.html',
  styleUrls: ['./administracionLibros.component.css']
})
export class AdministracionLibrosComponent {
  private librosService = inject(LibrosService);
  private router = inject(Router);
private dialog = inject(MatDialog);

  public listaLibros = new MatTableDataSource<Libros>();
 displayedColumns: string[] = [
  'portada',
  'titulo',
  'autor',
  'yearPublicacion',
  'genero',
  'favorito',
  'idioma',
  'sinopsis',
  'pdf',
  'accion'
];

  constructor() {
    this.obtenerLibros(); // Carga inicial
  }
getGeneroTexto(id: number): string {
  const generos: { [key: number]: string } = {
    1: 'Ficción',
    2: 'No ficción',
    3: 'Ciencia',
    4: 'Historia',
    5: 'Fantasía'
  };
  return generos[id] || 'Desconocido';
}
getPortadaUrl(nombre: string): string {
  return nombre ? `https://localhost:7105/Portadas/${nombre}` : '';
}

ocultarImagen(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none'; // Oculta la imagen si no se carga
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
const dialogRef = this.dialog.open(NuevoLibroComponent, {
    width: '500px',
    disableClose: true
  });
  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      this.obtenerLibros();
    }
  });
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
