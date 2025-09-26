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
  private apiUrl: string = appsettings.apiUrl + "/acceso"; // URL base de la API

  constructor() { }

  registrarse(objeto: Usuario): Observable<ResponseAcceso> { 
  return this.http.post<ResponseAcceso>(`${this.apiUrl}/Registrarse`, objeto);
}

login(objeto: Login): Observable<ResponseAcceso> {
  return this.http.post<ResponseAcceso>(`${this.apiUrl}/Login`, objeto);
}

}
