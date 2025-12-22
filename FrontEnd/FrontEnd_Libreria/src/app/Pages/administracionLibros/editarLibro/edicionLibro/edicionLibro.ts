import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Libros, Genero } from '../../../../interface/Libros';
import { LibrosService } from '../../../../Servicios/libros.service';
import { responseAPILibro } from '../../../../Models/responseAPILibro';
import { EditarLibroAdminDTO } from '../../../../interface/EditarLibroAdminDTO';

@Component({
  selector: 'app-edicion-libro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edicionLibro.html',
  styleUrls: ['./edicionLibro.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdicionLibro implements OnInit {
  archivoPDF?: File;
  portada?: File;

  constructor(
    private dialogRef: MatDialogRef<EdicionLibro>,
    private fb: FormBuilder,
    private librosService: LibrosService,
    @Inject(MAT_DIALOG_DATA) public data: { idLibro: string}
  ) {}

  generos = [
    { label: 'Terror', value: Genero.Terror },
    { label: 'Comedia', value: Genero.Comedia },
    { label: 'Romance', value: Genero.Romance },
    { label: 'Acción', value: Genero.Acción }
  ];

  formRegistro = this.fb.group({
  titulo: ['', Validators.required],
  autor: ['', Validators.required],
  yearPublicacion: [new Date().getFullYear(), Validators.required],
  genero: [Genero.Terror, Validators.required],
  idioma: ['', Validators.required],
  sinopsis: ['', Validators.required],
  disponibilidad: [true, Validators.required]
});

// Cargar datos del libro existente
  obtenerLibros() {
    this.librosService.obtener(this.data.idLibro).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const libro = response.data;
          this.formRegistro.patchValue({
            titulo: libro.titulo,
            autor: libro.autor,
            yearPublicacion: libro.yearPublicacion,
            genero: libro.genero,
            idioma: libro.idioma,
            sinopsis: libro.sinopsis,
            disponibilidad: libro.disponibilidad
          })
        } 
      },
      
    });
  }

ngOnInit() {
this.obtenerLibros();
}

onArchivoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.archivoPDF = input.files[0];
  }
}

onPortadaSeleccionada(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.portada = input.files[0];
  }
}



guardarLibro(): void {
  if (this.formRegistro.invalid) return;

  const formData = new FormData();

  formData.append('Titulo', this.formRegistro.value.titulo!);
  formData.append('Autor', this.formRegistro.value.autor!);
  formData.append(
    'YearPublicacion',
    this.formRegistro.value.yearPublicacion!.toString()
  );
  formData.append('Genero', this.formRegistro.value.genero!.toString());
  formData.append('Idioma', this.formRegistro.value.idioma!);
  formData.append('Sinopsis', this.formRegistro.value.sinopsis!);
  formData.append(
    'Disponibilidad',
    this.formRegistro.value.disponibilidad!.toString()
  );

  if (this.archivoPDF) {
    formData.append('ArchivoPDF', this.archivoPDF);
  }

  if (this.portada) {
    formData.append('Portada', this.portada);
  }

  this.librosService.editar(this.data.idLibro, formData).subscribe({
    next: () => this.dialogRef.close(true),
    error: err => console.error(err)
  });
}


  cancelar(): void {
    this.dialogRef.close(false);
  }
}
