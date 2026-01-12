import { Component, inject } from '@angular/core';


import { MatCardModule } from "@angular/material/card";
import { MatLabel, MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../../Servicios/acceso.service';
import { Router } from '@angular/router';
import { Usuario } from '../../interface/Usuario';
import { HttpClientModule } from '@angular/common/http';
import { passwordValidator } from '../../shared/validadores';
import { RegistrarDTO } from '../../interface/RegistrarDTO';
import { UsuariosService } from '../../Servicios/usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private router = inject(Router);

  public formRegistro = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), passwordValidator]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return pass === confirm ? null : { mismatch: true };
    }
  });

  guardar() {
    if (this.formRegistro.invalid) return;
    this.registrarse();
  }

  private registrarse() {
    const dto: RegistrarDTO = {
      nombre: this.formRegistro.value.nombre!,
      email: this.formRegistro.value.email!,
      password: this.formRegistro.value.password!
    };

    this.usuarioService.registrar(dto).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar usuario');
      }
    });
  }

  volver() {
    this.router.navigate(['/login']);
  }
}

