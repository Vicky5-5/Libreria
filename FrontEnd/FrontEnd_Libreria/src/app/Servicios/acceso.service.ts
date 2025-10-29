import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings/appsettings';
import { Usuario } from '../interface/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interface/ResponseAcceso';
import { Login } from '../interface/Login';

import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  obtenerUsuarios() {
    throw new Error('Method not implemented.');
  }

  private http = inject(HttpClient); // Inyección de HttpClient
  private apiUrl: string = appsettings.apiUrl + "/Login"; // URL base de la API

  constructor() { }

   registrarse(objeto: Usuario): Observable<ResponseAcceso<Usuario>> { 
    return this.http.post<ResponseAcceso<Usuario>>(`${this.apiUrl}/Registrarse`, objeto);
}

login(objeto: Login): Observable<ResponseAcceso<Login>> {
  return this.http.post<ResponseAcceso<Login>>(`${this.apiUrl}/Login`, objeto);
}

getRol(): string {
  const token = localStorage.getItem('token');
  if (!token) return '';

  try {
    const decoded: any = jwtDecode(token);
    // Verifica si el rol está en "role" o en el claim estándar de Microsoft
    return decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
  } catch {
    return '';
  }
}



}
