import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-index-admin',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './indexAdmin.component.html',
  styleUrl: './indexAdmin.component.css',
})
export class IndexAdminComponent {
  private router = inject(Router);

  administarLibros() {
    this.router.navigate(['/administracion-libros']);
  }
  administrarUsuarios() {
    this.router.navigate(['/administracion-usuarios']);
  }

  volver() {
    this.router.navigate(['/']);
  }
}
