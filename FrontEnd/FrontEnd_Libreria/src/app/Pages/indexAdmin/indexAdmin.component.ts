import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-index-admin',
  standalone: true,
  imports: [],
  template: `<p>indexAdmin works!</p>`,
  styleUrl: './indexAdmin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAdminComponent { }
