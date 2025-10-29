// admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccesoService } from '../../Servicios/acceso.service';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role === 'Admin';
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return false;
  }
};
