import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent} from './Componentes/barra-navegacion/barra-navegacion.component';
import { FooterComponent } from "./Componentes/footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { AccesoService } from './Servicios/acceso.service';
import { SignalrService } from './Servicios/signalr.service';
import { EstadoService } from './Servicios/estado.service';
import { ChatComponent } from "./Componentes/chat/chat.component";
import { ChatWidgetComponent } from "./shared/chat-widget/chat-widget.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarraNavegacionComponent, FooterComponent, RouterOutlet, ChatComponent, ChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Librería Alejandría';

  // Para mantener el log del usuario cuando recargue
  constructor(
    private accesoService: AccesoService,
    private signalRService: SignalrService,
    private estadoService: EstadoService


  ) {}

 ngOnInit(): void {
  if (this.accesoService.isLoggedIn()) {
    this.signalRService.startConnection(); // sin parámetro
    this.estadoService.iniciarSeguimiento();
  }
}
}

