import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosService } from '../../../Servicios/usuarios.service';
import { EdicionUsuarios } from '../edicionUsuarios/ediciónUsuarios/edicionUsuarios';

@Component({
  selector: 'app-dar-baja',
  standalone: true,
  imports: [    CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatDialogModule],
  templateUrl: './darBaja.html',
  styleUrls: ['./darBaja.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class DarBaja {

  formRegistro!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<DarBaja>,
    private usuarioService: UsuariosService,
    private fb: FormBuilder
  ) {
   
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuarioService.obtener(this.data.id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const usuario = response.data;
          this.formRegistro.patchValue({
            nombre: usuario.nombre,
            email: usuario.email,
            Admin: usuario.Admin,
            estado: usuario.estado
          });
        }
      }
    });
  }

  confirmarBaja() {
    this.usuarioService.darDeBaja(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true); // devolvemos que se realizó la baja
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}