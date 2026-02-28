import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SignalrService } from '../../Servicios/signalr.service';
import { AccesoService } from '../../Servicios/acceso.service';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule,MatMenuModule,RouterModule,CommonModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent {
  accesoService = inject(AccesoService);
  router = inject(Router);
  signalrService = inject(SignalrService);

  logout(): void {
    this.signalrService.stopConnection();
    this.accesoService.logout();
    this.router.navigate(['/login']);
  }
}
