import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Libros, Genero } from '../../../interface/Libros';
import { MatDialogContent } from "@angular/material/dialog";
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-nuevo-libro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogContent, FormsModule,
    MatDialogModule
],
  templateUrl: './nuevoLibro.component.html',
  styleUrls: ['./nuevoLibro.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoLibroComponent implements OnInit {
  libro: Libros = {
  idLibro: 0,
  rutaArchivoPortada: '',
  rutaArchivoPDF: '',
  titulo: '',
  autor: '',
  yearPublicacion: new Date().getFullYear(),
  genero: Genero.Terror,
  favorito: false,
  sinopsis: '',
  idioma: '',
  disponibilidad: true,
  archivoPDF: undefined,
  portada: undefined
};


  generos = [
  { label: 'Terror', value: 0 },
  { label: 'Comedia', value: 1 },
  { label: 'Romance', value: 2 },
  { label: 'Acción', value: 3 }
];


  constructor(private http: HttpClient, private route: ActivatedRoute) {}
private dialogRef = inject(MatDialogRef<NuevoLibroComponent>);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.cargarLibro(+id);
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.libro.archivoPDF = input.files[0];
    }
  }
onPortadaSeleccionada(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.libro.portada = input.files[0];
  }
}

  guardarLibro(): void {
    const formData = new FormData();
    formData.append('titulo', this.libro.titulo);
    formData.append('autor', this.libro.autor);
    formData.append('yearPublicacion', this.libro.yearPublicacion.toString());
    formData.append('genero', this.libro.genero.toString());
    formData.append('idioma', this.libro.idioma);
    formData.append('sinopsis', this.libro.sinopsis);
    formData.append('disponibilidad', this.libro.disponibilidad.toString());
    formData.append('favorito', this.libro.favorito.toString());

    if (this.libro.archivoPDF) {
      formData.append('archivoPDF', this.libro.archivoPDF);
    }
if (this.libro.portada) {
  formData.append('portada', this.libro.portada);
}

    const url = this.libro.idLibro
      ? `https://localhost:7105/api/libros/${this.libro.idLibro}`
      : `https://localhost:7105/api/libros`;

    const metodo = this.libro.idLibro ? 'put' : 'post';

   this.http[metodo](url, formData).subscribe({
  next: () => alert(this.libro.idLibro ? 'Libro actualizado' : 'Libro creado'),
  error: err => {
    console.error('Error al guardar libro:', err);

    if (err.status === 400 && err.error?.errors) {
      const errores = Object.entries(err.error.errors)
        .map(([campo, mensajes]) => `${campo}: ${mensajes}`)
        .join('\n');
      alert(`Error de validación:\n${errores}`);
    } else {
      alert('Error inesperado al guardar el libro.');
    }
  }
}); 
}

  cargarLibro(id: number): void {
    this.http.get<Libros>(`https://localhost:7105/api/libros/${id}`).subscribe({
      next: libro => this.libro = libro,
      error: err => console.error('Error al cargar libro:', err)
    });
  }

  cancelar(){
    this.dialogRef.close(false);
  }
}
