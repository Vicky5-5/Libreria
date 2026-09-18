import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearGrupoRequest {
  nombre: string;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class chatGrupoService {
  private http = inject(HttpClient);
  private baseUrl = '/api/chatgrupo'; // ajustá según tu backend

  crearGrupo(data: CrearGrupoRequest): Observable<string> {
    // el backend debería sacar el creadorId del usuario autenticado (token),
    // no hace falta mandarlo desde el front
    return this.http.post<string>(`${this.baseUrl}/crear`, data);
  }
}