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
import { MatDialog } from '@angular/material/dialog';
import { CrearUsuarioComponent } from './crearUsuarios/crearUsuario.component/crearUsuario.component';
import { responseAPIUsuario } from '../../Models/responseAPIUsuario';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { EdicionLibro } from '../administracionLibros/editarLibro/edicionLibro/edicionLibro';
import { EdicionUsuarios } from './edicionUsuarios/ediciónUsuarios/edicionUsuarios';
import { DarBaja } from './darBaja/darBaja';
import { DarAlta } from './darAlta/darAlta';

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
private dialog = inject(MatDialog);

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
     addUser() {
  const dialogRef = this.dialog.open(CrearUsuarioComponent, {
    width: '500px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      this.obtenerUsuarios();
    }
  });
}

editar(usuario: Usuario) {
  this.dialog.open(EdicionUsuarios, {
    width: '450px',
    data: { id: usuario } 
  }).afterClosed().subscribe(result => {
    if (result) this.obtenerUsuarios(); 
  });
}  
darDeBaja(usuario: Usuario) {
   this.dialog.open(DarBaja, {
    width: '450px',
    data: { id: usuario } 
  }).afterClosed().subscribe(result => {
    if (result) this.obtenerUsuarios(); 
  });

  
}
darDeAlta(usuario: Usuario) {
  this.dialog.open(DarAlta, {
    width: '450px',
    data: { id: usuario }
  }).afterClosed().subscribe(result => {
    if (result) this.obtenerUsuarios();
  });
}
  volver() {
    this.router.navigate([""]);
  }


}
