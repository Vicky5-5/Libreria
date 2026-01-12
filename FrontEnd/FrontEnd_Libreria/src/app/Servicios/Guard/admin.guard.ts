// admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../../Servicios/acceso.service';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = () => {
  const accesoService = inject(AccesoService);
  const router = inject(Router);

  if (accesoService.isAdmin()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

