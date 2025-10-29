import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../interface/Usuario';
import { AccesoService } from '../../Servicios/acceso.service';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatHeaderCellDef, MatCellDef, MatHeaderCell, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Libros } from '../../interface/Libros';
import { responseAPIUsuario } from '../../Models/responseAPIUsuario';
import { UsuariosService } from '../../Servicios/usuarios.service';

@Component({
  selector: 'app-administracion-usuarios',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule, MatCardModule, MatHeaderCellDef, MatCellDef, MatHeaderCell, MatTableModule],
  templateUrl: './administracion_usuarios.component.html',
  styleUrl: './administracion_usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministracionUsuariosComponent { 
      private router = inject(Router);
      public formBuild = inject(FormBuilder);
private usuarioService = inject(UsuariosService);

      public formRegistro = this.formBuild.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    admin: [false],
    estado: [true] 
      });
public mostrarFormulario = false;
public displayedColumns: string[] = ['nombre', 'email', 'admin', 'estado', 'fechaRegistro', 'accion'];
public listaUsuarios = new MatTableDataSource<Usuario>();

constructor() {
    this.obtenerUsuarios(); // Carga inicial
  }
 obtenerUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (response: responseAPIUsuario<Usuario[]>) => {
        if (response.isSuccess) {
          this.listaUsuarios.data = response.data;
        } else {
          console.warn('La respuesta no fue exitosa:', response.message);
        }
      },
      error: (err: any) => {
        console.error('Error al cargar libros:', err.message);
      }
    });
  }
     addUser(){
      this.router.navigate(['/administracion_usuarios/crearUsuario']);
     }
  editar(usuario: Usuario) {
      // this.router.navigate(['/libros', usuario.idUsuario]);
    }
  
    darDeBaja(libro: Usuario) {
      // if (confirm(`¿Desea eliminar el libro "${libro.titulo}"?`)) {
      //   this.librosService.borrar(libro.idLibro).subscribe({
      //     next: (data: any) => {
      //       if (data.isSuccess) {
      //         this.obtenerLibros();
      //       } else {
      //         alert('No se pudo eliminar el libro');
      //       }
      //     },
      //     error: (err: any) => {
      //       console.error('Error al eliminar libro:', err.message);
      //       alert('No se pudo eliminar el libro');
      //     }
      //   });
      // }
    }
  volver() {
    this.router.navigate([""]);
  }


}
