import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CrearUsuariosAdminDTO } from '../../../../interface/CrearUsuariosAdminDTO';
import { passwordValidator } from '../../../../shared/validadores';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearUsuarioComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private dialogRef = inject(MatDialogRef<CrearUsuarioComponent>);

  public formRegistro = this.buildForm();

  /** Construcción del formulario con validadores */
  private buildForm() {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      admin: [false],
      estado: [true]
    }, {
      validators: (group) => {
        const pass = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return pass === confirm ? null : { mismatch: true };
      }
    });
  }

  registrarse() {
    if (this.formRegistro.invalid) return;

    const dto: CrearUsuariosAdminDTO = {
      nombre: this.formRegistro.value.nombre!,
      email: this.formRegistro.value.email!,
      password: this.formRegistro.value.password!,
      Admin: this.formRegistro.value.admin!,
      estado: this.formRegistro.value.estado!
    };

    this.usuarioService.crear(dto).subscribe({
      next: (data) => this.handleResponse(data),
      error: (err) => console.error('Error al registrarse:', err)
    });
  }

  private handleResponse(data: any) {
    console.log('Respuesta del backend:', data);
  if (data && data.id) {  
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      this.router.navigate(['/administracionUsuarios']);
      this.dialogRef.close(true);
    } else {
      alert('Error al registrarse. Por favor, intenta de nuevo.');
    }
  }

  volver() {
    this.dialogRef.close(false);
  }
}
