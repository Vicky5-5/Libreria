import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-administracion-usuarios',
  standalone: true,
  imports: [],
  template: `<p>administracion_usuarios works!</p>`,
  styleUrl: './administracion_usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministracionUsuariosComponent { }
