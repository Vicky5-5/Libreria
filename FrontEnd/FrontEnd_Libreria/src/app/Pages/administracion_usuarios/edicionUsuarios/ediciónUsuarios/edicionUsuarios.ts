import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosService } from '../../../../Servicios/usuarios.service';
import { EdicionUsuariosAdminDTO } from '../../../../interface/EdicionUsuarioAdminDTO';

@Component({
  selector: 'app-edicion-usuarios',
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
  templateUrl: './edicionUsuarios.html',
  styleUrls: ['./edicionUsuarios.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdicionUsuarios {

constructor(
  @Inject(MAT_DIALOG_DATA) public data: { id: string },
  private dialogRef: MatDialogRef<EdicionUsuarios>,
  private usuarioService: UsuariosService,
  private fb: FormBuilder
) {}


formRegistro = this.fb.group({
  nombre: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  Admin: [false, Validators.required],
  estado: [true],
  password: [''],
  confirmPassword: ['']
}, { validators: this.passwordMatchValidator });

passwordMatchValidator(group: any) {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

ngOnInit() {

  this.obtenerUsuarios();

}

obtenerUsuarios() {
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

guardar() {
  if (this.formRegistro.invalid) return;

  const dto: EdicionUsuariosAdminDTO = {
    nombre: this.formRegistro.value.nombre!,
    email: this.formRegistro.value.email!,
    Admin: this.formRegistro.value.Admin!,
    estado: this.formRegistro.value.estado!,
    password: this.formRegistro.value.password || undefined,
    confirmPassword: this.formRegistro.value.confirmPassword || undefined
  };

  this.usuarioService.editar(this.data.id, dto).subscribe({
    next: () => {
      alert("Usuario actualizado correctamente");
      this.dialogRef.close(true);
    }
  });
}

  volver() {
    this.dialogRef.close(false);
  }
}
