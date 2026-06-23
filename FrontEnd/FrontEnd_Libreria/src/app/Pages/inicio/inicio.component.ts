import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioComponent {

  private router = inject(Router);

  listarlibros() {
    this.router.navigate(['/listado-libros']);
  }

}