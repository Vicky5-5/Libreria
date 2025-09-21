import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent} from './Componentes/barra-navegacion/barra-navegacion.component';
import { FooterComponent } from "./Componentes/footer/footer.component";
import { InicioComponent } from './Pages/inicio/inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarraNavegacionComponent, FooterComponent, InicioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Librería Alejandría';
}
