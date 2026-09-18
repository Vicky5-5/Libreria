
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { SignalrService } from '../../../../Servicios/signalr.service';

@Component({
  selector: 'app-nuevo-grupo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './nuevoGrupo.html',
  styleUrl: './nuevoGrupo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoGrupo {

  private fb = inject(FormBuilder);
  private signalr = inject(SignalrService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  guardando = false;
  errorMsg = '';

  public formNuevoGrupo = this.fb.group({
    nombreGrupo: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    ],

    descripcionGrupo: [
      '',
      [
        Validators.maxLength(200)
      ]
    ]
  });

  crearGrupoNuevo(): void {

    if (
      this.formNuevoGrupo.invalid ||
      this.guardando
    ) {
      this.formNuevoGrupo.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';

    this.cdr.markForCheck();

    const {
      nombreGrupo,
      descripcionGrupo
    } = this.formNuevoGrupo.getRawValue();

    this.signalr.crearGrupo(
      nombreGrupo!,
      descripcionGrupo || undefined
    )
    .then((grupoId) => {

      this.router.navigate([
        '/chat',
        grupoId
      ]);

    })
    .catch((err) => {

      console.error(
        'Error al crear grupo:',
        err
      );

      this.errorMsg =
        err?.message ??
        'Error al crear el grupo';

      this.guardando = false;

      this.cdr.markForCheck();
    });
  }
}

