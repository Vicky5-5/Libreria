import { Component, inject } from '@angular/core';
import { AccesoService } from '../../Servicios/acceso.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interface/Login';

import { MatCardModule } from "@angular/material/card";
import { MatLabel, MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatLabel, MatError, ReactiveFormsModule, CommonModule, MatInputModule,MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
 isAdmin(): boolean {
  return this.accesoService.getRol() === 'Admin';
}

getRol(): string {
  const token = localStorage.getItem('token');
  if (!token) return '';

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || ''; // Asegúrate de que el backend incluya "role"
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return '';
  }
}

  iniciarSesion() {
  if (this.formLogin.invalid) return;

  const objeto: Login = {
    email: this.formLogin.value.email!,
    password: this.formLogin.value.password!
  };

  this.accesoService.login(objeto).subscribe({
    next: (data) => {
      if (data.isSuccess) {
        localStorage.setItem('token', data.token);

        const rol = this.accesoService.getRol();
        if (rol === 'Admin') {
          this.router.navigate(['/index-admin']);
        } else {
          this.router.navigate(['/index-usuario']);
        }
      } else {
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    },
    error: (err:HttpErrorResponse) => {
      const mensaje = err.error?.message || 'Error desconocido';
      alert('Error al iniciar sesión: ' + mensaje);
      console.error('Detalles del error:', err);
    }
  });
}
  
   volver() {
     this.router.navigate([""]);
   }
}
