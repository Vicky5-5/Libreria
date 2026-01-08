import { inject, Injectable } from '@angular/core';
import { Usuario } from '../interface/Usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseAPIUsuario } from '../Models/responseAPIUsuario';
import { appsettings } from '../Settings/appsettings/appsettings';
import { CrearUsuariosAdminDTO } from '../interface/CrearUsuariosAdminDTO';
import { EdicionUsuariosAdminDTO } from '../interface/EdicionUsuarioAdminDTO';
import { RegistrarDTO } from '../interface/RegistrarDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "/Usuario";

  listar(): Observable<responseAPIUsuario<Usuario[]>> {
    return this.http.get<responseAPIUsuario<Usuario[]>>(this.apiUrl);
  }

  obtener(id: string): Observable<responseAPIUsuario<Usuario>> {
    return this.http.get<responseAPIUsuario<Usuario>>(`${this.apiUrl}/${id}`);
  }

  crear(objeto: CrearUsuariosAdminDTO): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrl}/Registrar`, objeto);
}
registrar(objetos: RegistrarDTO): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/RegistrarNuevoUsuario`, objetos);
  }
  darDeBaja(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/baja`, {});
  }
 darDeAltaAdmin(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/alta`, {});
  }

  editar(Id: string, objeto: EdicionUsuariosAdminDTO): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${Id}`, objeto);
  }


  borrar(id: string): Observable<any> {
    return this.http.delete<responseAPIUsuario<any>>(`${this.apiUrl}/${id}`);
  }
}
