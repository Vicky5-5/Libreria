import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent {}
