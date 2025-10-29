import { inject, Injectable } from '@angular/core';
import { Usuario } from '../interface/Usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseAPIUsuario } from '../Models/responseAPIUsuario';
import { appsettings } from '../Settings/appsettings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "/usuarios";

  listar(): Observable<responseAPIUsuario<Usuario[]>> {
    return this.http.get<responseAPIUsuario<Usuario[]>>(this.apiUrl);
  }

  obtener(id: string): Observable<responseAPIUsuario<Usuario>> {
    return this.http.get<responseAPIUsuario<Usuario>>(`${this.apiUrl}/${id}`);
  }

  crear(objeto: Usuario): Observable<responseAPIUsuario<Usuario>> {
    return this.http.post<responseAPIUsuario<Usuario>>(this.apiUrl, objeto);
  }

  editar(objeto: Usuario): Observable<responseAPIUsuario<Usuario>> {
    return this.http.put<responseAPIUsuario<Usuario>>(`${this.apiUrl}/${objeto.id}`, objeto);
  }

  borrar(id: string): Observable<any> {
    return this.http.delete<responseAPIUsuario<any>>(`${this.apiUrl}/${id}`);
  }
}
