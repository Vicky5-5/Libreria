import { Routes } from '@angular/router';
import { AdministracionComponent } from './Pages/administracion/administracion.component';
import { InicioComponent } from './Pages/inicio/inicio.component';

export const routes: Routes = [
    {path: 'Inicio', component: InicioComponent},

    {path: 'Administracion', component: AdministracionComponent}
];
