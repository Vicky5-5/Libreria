import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: `./Contacto.html`,
  styleUrl: './Contacto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacto {}
