import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-grupo',
  standalone: true,
  imports: [MatFormFieldModule, MatCardModule],
  templateUrl: './nuevoGrupo.html',
  styleUrl: './nuevoGrupo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoGrupo {

  private fb = inject(FormBuilder);
  private usuario = inject(UsuarioService);
  private router = inject(Router);

  public formNuevoGrupo = this.fb.group({
    nombreGrupo: [''],
    descripcionGrupo: ['']
  });

  crearGrupoNuevo(): void {

  }


}
