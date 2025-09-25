import { Component, inject } from '@angular/core';
import { AccesoService } from '../../Servicios/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interface/Login';

import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatLabel, MatError, ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin = this.formBuild.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  iniciarSesion() {
    if(this.formLogin.invalid) return;

    const objeto:Login = {
      correo: this.formLogin.value.correo!,
      password: this.formLogin.value.password!
    }
    this.accesoService.login(objeto).subscribe({
      next: (data) => {
        if(data.isSuccess){
          localStorage.setItem('token', data.token);
          this.router.navigate(['/inicio']);
        } else {
          alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
      }
    })
  }
  registrarse() {
    this.router.navigate(['/registro']);
  }
}
