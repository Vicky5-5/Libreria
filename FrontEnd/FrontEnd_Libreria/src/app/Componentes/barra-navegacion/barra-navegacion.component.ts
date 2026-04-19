import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { SignalrService } from '../../Servicios/signalr.service';
import { AccesoService } from '../../Servicios/acceso.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { EstadoService } from '../../Servicios/estado.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent {

  accesoService = inject(AccesoService);
  router = inject(Router);
  signalrService = inject(SignalrService);
  estadoService = inject(EstadoService);
  usuario$ = this.accesoService.usuario$;

  logout(): void {
    this.signalrService.stopConnection();
    this.accesoService.logout();
    this.estadoService.setLogueado(false);
    this.router.navigate(['/login']);
  }
}