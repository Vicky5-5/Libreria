import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Login } from '../interface/Login';
import { ResponseAcceso } from '../interface/ResponseAcceso';
import { Usuario } from '../interface/Usuario';

@Injectable({ providedIn: 'root' })
export class AccesoService {

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7105/api/auth'; // ajusta según tu backend

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getRol(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role ?? '';
    } catch {
      return '';
    }
  }
  getUsuario(): Partial<Usuario> {
    const token = this.getToken();
    if (!token) return {};
    try {
      const decoded: any = jwtDecode(token);
      return {
        nombre: decoded.unique_name || decoded.name || '',
        Admin: decoded.role === 'Admin'
      };
    } catch {
      return {};
    }
  }

  isAdmin(): boolean {
    return this.getRol() === 'Admin';
  }
getNombre(): string {
    return this.getUsuario().nombre || '';
  }
  
 login(objeto: Login): Observable<ResponseAcceso<Login>> {
  return this.http.post<ResponseAcceso<Login>>(`${this.apiUrl}/login`, objeto);
}
isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout(): void {
  if (isPlatformBrowser(this.platformId)) localStorage.removeItem('token');
}
}
