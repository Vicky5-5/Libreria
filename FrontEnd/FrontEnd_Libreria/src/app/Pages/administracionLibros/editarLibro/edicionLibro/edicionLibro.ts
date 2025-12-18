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




ngOnInit() {
this.librosService.obtener(this.data.idLibro).subscribe({
  next: (response) =>{
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
      });
    }
  }
})
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

 const dto: EditarLibroAdminDTO = {
  titulo: this.formRegistro.value.titulo!,
  autor: this.formRegistro.value.autor!,
  YearPublicacion: this.formRegistro.value.yearPublicacion!,
  genero: this.formRegistro.value.genero!,
  idioma: this.formRegistro.value.idioma!,
  sinopsis: this.formRegistro.value.sinopsis!,
  disponibilidad: this.formRegistro.value.disponibilidad!,
  archivoPDF: this.archivoPDF || undefined,
  portada: this.portada || undefined
};

this.librosService.editar(this.data.idLibro, dto).subscribe({
  next: () => this.dialogRef.close(true),
  error: err => console.error(err)
});

}


  cancelar(): void {
    this.dialogRef.close(false);
  }
}
