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
import { HttpErrorResponse } from '@angular/common/http';
import { SignalrService } from '../../Servicios/signalr.service';
import { EstadoService } from '../../Servicios/estado.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  private signalrService = inject(SignalrService);
  private estadoService = inject(EstadoService);
  public formBuild = inject(FormBuilder);

  ocultar: boolean = true;

  public formLogin = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  iniciarSesion() {
    if (this.formLogin.invalid) return;

    const objeto: Login = {
      email: this.formLogin.value.email!,
      password: this.formLogin.value.password!
    };

    this.accesoService.login(objeto).subscribe({
      next: (data) => {
        if (data.isSuccess) {

          // ✅ CLAVE
          this.accesoService.setToken(data.token);

          this.signalrService.startConnection();
          this.estadoService.iniciarSeguimiento();

          const usuario = this.accesoService.getUsuario();

          if (usuario.Admin) {
            this.router.navigate(['/index-admin']);
          } else {
            this.router.navigate(['/index-usuario']);
          }

        } else {
          alert('Credenciales incorrectas');
        }
      },
      error: (err: HttpErrorResponse) => {
        const mensaje = err.error?.message || 'Error desconocido';
        alert('Error: ' + mensaje);
      }
    });
  }

  volver() {
    this.router.navigate([""]);
  }
}