import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-listado-libros',
  standalone: true,
  imports: [],
  template: `<p>listado_libros works!</p>`,
  styleUrl: './listado_libros.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoLibrosComponent { }
