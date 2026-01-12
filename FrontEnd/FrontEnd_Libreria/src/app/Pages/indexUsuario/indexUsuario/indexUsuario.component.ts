import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { LibrosService } from '../../../Servicios/libros.service';
import { Libros } from '../../../interface/Libros';
import { responseAPILibro } from '../../../Models/responseAPILibro';
import { PortadasComponent } from '../../administracionLibros/portadas/portadas.component/portadas.component';

@Component({
  selector: 'app-index-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    PortadasComponent
  ],
  templateUrl: './indexUsuario.component.html',
  styleUrls: ['./indexUsuario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexUsuarioComponent implements OnInit {

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
    'disponibilidad',
    'idioma',
    'sinopsis',
    'pdf'
    ];

  ngOnInit(): void {
    this.obtenerLibros();
  }

  obtenerLibros(): void {
    this.librosService.listar().subscribe({
      next: (response: responseAPILibro<Libros[]>) => {
        if (response.isSuccess) {
          this.listaLibros.data = response.data;
        } else {
          console.warn('La respuesta no fue exitosa:', response.message);
        }
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
      }
    });
  }

  getGeneroTexto(id: number): string {
    const generos: Record<number, string> = {
      1: 'Ficción',
      2: 'No ficción',
      3: 'Ciencia',
      4: 'Historia',
      5: 'Fantasía'
    };
    return generos[id] ?? 'Desconocido';
  }

  descargar(libro: Libros): void {
    this.librosService.descargarLibro(libro.rutaArchivoPDF).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${libro.titulo}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('No se pudo descargar el archivo.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
