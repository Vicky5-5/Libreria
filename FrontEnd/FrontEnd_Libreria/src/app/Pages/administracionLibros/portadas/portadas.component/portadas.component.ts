import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Libros } from '../../../../interface/Libros';

@Component({
  selector: 'app-portadas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
  [src]="libro?.rutaArchivoPortada ? getUrl() : 'assets/img/noDisponible.png'"
  [alt]="libro?.titulo || 'Portada'"
  [width]="width"
  [height]="height"
/>

  `
})
export class PortadasComponent { 
  @Input() libro!: Libros;
  @Input() width: number = 50;
  @Input() height: number = 75;

 getUrl(): string {
    return `https://localhost:7105${this.libro.rutaArchivoPortada}`;
  }

  ocultar(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src= '/assets/img/noDisponible.png';
  }
}



