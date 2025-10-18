// admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccesoService } from '../../Servicios/acceso.service';

export const adminGuard: CanActivateFn = () => {
  const acceso = inject(AccesoService);
  const rol = acceso.getRol();
  return rol === 'Admin';
};
