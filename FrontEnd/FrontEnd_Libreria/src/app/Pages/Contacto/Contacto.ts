import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: `./Contacto.html`,
  styleUrl: './Contacto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacto {}
