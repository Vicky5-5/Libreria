import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent } from './Componentes/barra-navegacion/barra-navegacion.component';
import { FooterComponent } from './Componentes/footer/footer.component';
import { AccesoService } from './Servicios/acceso.service';
import { SignalrService } from './Servicios/signalr.service';
import { EstadoService } from './Servicios/estado.service';
import { ChatWidgetComponent } from './shared/chat-widget/chat-widget.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BarraNavegacionComponent,
    FooterComponent,
    ChatWidgetComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  estaLogueado = false;

  constructor(
    private accesoService: AccesoService,
    private signalRService: SignalrService,
    private estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.estaLogueado = this.accesoService.isLoggedIn();

    if (this.estaLogueado) {
      this.signalRService.startConnection();
      this.estadoService.iniciarSeguimiento();
    }
  }
}