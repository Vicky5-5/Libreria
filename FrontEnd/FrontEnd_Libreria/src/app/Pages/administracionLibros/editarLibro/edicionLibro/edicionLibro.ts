import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edicion-libro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edicionLibro.html',
  styleUrl: './edicionLibro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdicionLibro { }
