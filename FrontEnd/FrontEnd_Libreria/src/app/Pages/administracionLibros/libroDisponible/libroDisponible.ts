import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { LibrosService } from '../../../Servicios/libros.service';
import { LibroNoDisponible } from '../libroNoDisponible/libroNoDisponible';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-libro-disponible',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule],
  templateUrl: `./libroDisponible.html`,
  styleUrl: './libroDisponible.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibroDisponible {
  formRegistro!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idLibro: string },
    private librosService: LibrosService,
    private dialogRef: MatDialogRef<LibroNoDisponible>,
    private fb: FormBuilder
  ) {
    this.obtenerLibros();
  }

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
  confirmarDisponible() {
    this.librosService.libroDisponible(this.data.idLibro).subscribe({
      next: () => {
        this.dialogRef.close(true);
      }
    });
  }
  cancelar() {
    this.dialogRef.close(false);
  }
}
