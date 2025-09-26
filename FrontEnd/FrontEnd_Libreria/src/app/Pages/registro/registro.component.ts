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

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
      private accesoService = inject(AccesoService);
      private router = inject(Router);
      public formBuild = inject(FormBuilder);
    
      public formRegistro = this.formBuild.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });

      registrase() {
        if(this.formRegistro.invalid) return;
        const objeto: Usuario = {
          nombre: this.formRegistro.value.nombre!,
          correo: this.formRegistro.value.correo!,
          password: this.formRegistro.value.password!,
          Admin: false,
          fechaRegistro: new Date(),
          estado: true
        }
      this.accesoService.registrarse(objeto).subscribe({
        next: (data) => {
          if(data.isSuccess){
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            this.router.navigate(['/login']);
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
    this.router.navigate([""]);
  }
}
