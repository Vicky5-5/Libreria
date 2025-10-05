import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings/appsettings';
import { Usuario } from '../interface/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interface/ResponseAcceso';
import { Login } from '../interface/Login';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient); // Inyección de HttpClient
  private apiUrl: string = appsettings.apiUrl + "/Login"; // URL base de la API

  constructor() { }

   registrarse(objeto: Usuario): Observable<ResponseAcceso<Usuario>> { 
    return this.http.post<ResponseAcceso<Usuario>>(`${this.apiUrl}/Registrarse`, objeto);
}

login(objeto: Login): Observable<ResponseAcceso<Login>> {
  return this.http.post<ResponseAcceso<Login>>(`${this.apiUrl}/Login`, objeto);
}

}
