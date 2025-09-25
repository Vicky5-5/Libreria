import { Routes } from '@angular/router';
import { AdministracionComponent } from './Pages/administracion/administracion.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegistroComponent } from './Pages/registro/registro.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent },
  { path: 'administracion', component: AdministracionComponent }
];

