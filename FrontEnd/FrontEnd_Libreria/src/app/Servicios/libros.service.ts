import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libros } from '../Models/libros/libros.model';
import { responseAPILibro } from '../Models/responseAPILibro';
import { appsettings } from '../Settings/appsettings/appsettings';


@Injectable({
  providedIn: 'root'
})
export class LibrosService {

private http = inject(HttpClient); //inyectamos el servicio del cliente

  private apiUrl:string =appsettings.apiUrl + "/libros";

constructor(){
  this.listar();
}

  listar(): Observable<responseAPILibro<Libros[]>> {
    return this.http.get<responseAPILibro<Libros[]>>(this.apiUrl);
  }

 obtener(id: number): Observable<responseAPILibro<Libros>> {
    return this.http.get<responseAPILibro<Libros>>(`${this.apiUrl}/${id}`);
  }
  

 crear(objeto: Libros): Observable<responseAPILibro<Libros>> {
    return this.http.post<responseAPILibro<Libros>>(this.apiUrl, objeto);
  }

 editar(objeto: Libros): Observable<responseAPILibro<Libros>> {
    return this.http.put<responseAPILibro<Libros>>(`${this.apiUrl}/${objeto.idLibro}`, objeto);
  }

  borrar(id:number): Observable<any>{
    return this.http.delete<responseAPILibro<any>>(`${this.apiUrl}/${id}`);  }
}
