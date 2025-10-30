import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatHeaderCellDef, MatCellDef, MatHeaderCell, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Usuario } from '../../../../interface/Usuario';
import { UsuariosService } from '../../../../Servicios/usuarios.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-usuario.component',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatIconModule, MatCardModule, MatTableModule, MatDialogModule,FormsModule],
  templateUrl: `./crearUsuario.component.html`,
  styleUrl: './crearUsuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearUsuarioComponent { 
    private router = inject(Router);
      public formBuild = inject(FormBuilder);
private usuarioService = inject(UsuariosService);
private dialogRef = inject(MatDialogRef<CrearUsuarioComponent>);

      public formRegistro = this.formBuild.group({
  nombre: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', [Validators.required]],
  Admin: [false],
  estado: [true]
}, {
  validators: (group) => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
});

   registrarse() {
          if(this.formRegistro.invalid) return;
          const objeto: Usuario = {
            nombre: this.formRegistro.value.nombre!,
            email: this.formRegistro.value.email!,
            password: this.formRegistro.value.password!,
            Admin: this.formRegistro.value.Admin!,
            fechaRegistro: new Date(),
            estado: true
          }
        this.usuarioService.crear(objeto).subscribe({
          next: (data) => {
              console.log('Respuesta del backend:', data);  console.log('Respuesta del backend:', data);
            if(data.isSuccess){
              alert('Registro exitoso. Ahora puedes iniciar sesión.');
              this.router.navigate(['/Login']);
            } else {
              alert('Error al registrarse. Por favor, intenta de nuevo.');
            }
          },
          error: (err) => {
            console.error('Error al registrarse:', err);
          }
        })
    }
    volver() {
  this.dialogRef.close(false);
}

}
