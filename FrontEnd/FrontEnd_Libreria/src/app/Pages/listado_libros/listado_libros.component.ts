import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { PortadasComponent } from "../administracionLibros/portadas/portadas.component/portadas.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { LibrosService } from '../../Servicios/libros.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Libros } from '../../interface/Libros';
import { responseAPILibro } from '../../Models/responseAPILibro';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-listado-libros',
  standalone: true,
  imports: [CommonModule, MatIcon, MatPaginatorModule, MatSortModule,MatTableModule,MatCardModule, MatButtonModule,MatDialogModule, PortadasComponent],
  templateUrl: `./listado_libros.html`,
  styleUrls: ['./listado_libros.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoLibrosComponent { 
  private router = inject(Router);
  
  private librosService = inject(LibrosService);
private dialog = inject(MatDialog);

  public listaLibros = new MatTableDataSource<Libros>();
 displayedColumns: string[] = [
  'portada',
  'titulo',
  'autor',
  'yearPublicacion',
  'genero',
  'idioma',
  'sinopsis',
];

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
ngOnInit() {
this.obtenerLibros();
}
   volver() {
     this.router.navigate([""]);
   }
}
