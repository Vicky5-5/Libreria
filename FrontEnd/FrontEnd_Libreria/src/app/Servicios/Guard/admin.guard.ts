import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../../Servicios/acceso.service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {

  const accesoService = inject(AccesoService);
  const router = inject(Router);

  return accesoService.usuario$.pipe(
    take(1),
    map(user => {

      if (user?.Admin) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};