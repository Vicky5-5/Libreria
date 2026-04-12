import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Login } from '../interface/Login';
import { ResponseAcceso } from '../interface/ResponseAcceso';
import { Usuario } from '../interface/Usuario';

@Injectable({ providedIn: 'root' })
export class AccesoService {

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7105/api/auth';

  private usuarioSubject = new BehaviorSubject<Partial<Usuario>>({});
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    const token = this.getToken();
    if (token) {
      this.usuarioSubject.next(this.decodeToken(token));
    }
  }

  // ✅ Guardar token y actualizar usuario
 setToken(token: string): void {
  localStorage.setItem('token', token);

  const usuario = this.decodeToken(token);
  console.log('Usuario actualizado:', usuario);
  this.usuarioSubject.next(usuario); // 🔥 CLAVE
}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // ✅ Decodificar token (centralizado)
  private decodeToken(token: string): Partial<Usuario> {
    try {
      const decoded: any = jwtDecode(token);
      console.log('Token decodificado:', decoded);

      return {
        nombre:
          decoded.unique_name ||
          decoded.name ||
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          '',
        Admin: decoded.role === 'Admin'
      };
    } catch {
      return {};
    }
  }

  getUsuario(): Partial<Usuario> {
    return this.usuarioSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(objeto: Login): Observable<ResponseAcceso<Login>> {
    return this.http.post<ResponseAcceso<Login>>(`${this.apiUrl}/login`, objeto);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.usuarioSubject.next({});
  }
}