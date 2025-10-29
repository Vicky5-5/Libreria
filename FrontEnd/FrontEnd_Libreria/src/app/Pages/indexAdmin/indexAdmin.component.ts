import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index-admin',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, RouterModule],
  templateUrl: './indexAdmin.component.html',
  styleUrl: './indexAdmin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAdminComponent { }
