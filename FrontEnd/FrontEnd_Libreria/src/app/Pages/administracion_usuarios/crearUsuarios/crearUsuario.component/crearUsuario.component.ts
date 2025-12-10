import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../Servicios/usuarios.service';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrearUsuariosAdminDTO } from '../../../../interface/CrearUsuariosAdminDTO';
import { passwordValidator } from '../../../../shared/validadores';
import { Usuario } from '../../../../interface/Usuario';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './crearUsuario.component.html',
  styleUrls: ['./crearUsuario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearUsuarioComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private dialogRef = inject(MatDialogRef<CrearUsuarioComponent>);

  modoEdicion = false;

  /** Form */
  public formRegistro = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6), passwordValidator]],
    confirmPassword: ['', Validators.required],
    admin: [false],
    estado: [true]
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return pass === confirm ? null : { mismatch: true };
    }
  });

  // Boton guardar para ambas acciones
  guardar() {
    if (this.formRegistro.invalid) return;

    this.registrarUsuario();
  }

  // Crear nuevo usuario
 private registrarUsuario() {
  const dto: CrearUsuariosAdminDTO = {
    nombre: this.formRegistro.value.nombre!,
    email: this.formRegistro.value.email!,
    password: this.formRegistro.value.password!,
    Admin: this.formRegistro.value.admin!,
    estado: this.formRegistro.value.estado!
  };

  this.usuarioService.crear(dto).subscribe({
    next: (data) => this.handleResponse(data, "Usuario creado correctamente"),
    error: (err) => console.error('Error al crear usuario:', err)
  });
}



  // Respuesta común
  private handleResponse(data: any, mensaje: string) {
    if (data && data.id) {
      alert(mensaje);
      this.dialogRef.close(true);
    } else {
      alert('Error en la operación.');
    }
  }

  volver() {
    this.dialogRef.close(false);
  }
}
