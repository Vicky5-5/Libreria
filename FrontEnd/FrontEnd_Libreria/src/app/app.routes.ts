import { Routes } from '@angular/router';
import { AdministracionLibrosComponent } from './Pages/administracionLibros/administracionLibros.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegistroComponent } from './Pages/registro/registro.component';
import { AdministracionUsuariosComponent } from './Pages/administracion_usuarios/administracion_usuarios.component';
import { IndexAdminComponent } from './Pages/indexAdmin/indexAdmin.component';
import { adminGuard } from './Servicios/Guard/admin.guard';
import { NuevoLibroComponent } from './Pages/administracionLibros/nuevoLibro/nuevoLibro.component';
import { IndexUsuarioComponent } from './Pages/indexUsuario/indexUsuario/indexUsuario.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  {path: 'Login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent },
  {path: 'indexAdmin', component: IndexAdminComponent, canActivate:[adminGuard] }, // Donde va el administrador. Ahi puede elegir entre editar usuarios o libros
  {path: 'indexUsuario', component: IndexUsuarioComponent }, // Donde va el usuario normal
  { path: 'administracionLibros', component: AdministracionLibrosComponent }, // Es es el de los libros
  { path: 'administracionUsuarios', component: AdministracionUsuariosComponent }, // Es el de los usuarios
  { path: 'libros/nuevo', component: NuevoLibroComponent }, //Creacion de nuevo libro
  { path: 'libros/:id', component: NuevoLibroComponent } //Edicion de libro existente
];

