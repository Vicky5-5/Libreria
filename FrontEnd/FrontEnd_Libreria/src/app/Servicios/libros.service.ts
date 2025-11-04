import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libros } from '../interface/Libros';
import { responseAPILibro } from '../Models/responseAPILibro';
import { appsettings } from '../Settings/appsettings/appsettings';


@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "/libros";

  listar(): Observable<responseAPILibro<Libros[]>> {
    return this.http.get<responseAPILibro<Libros[]>>(this.apiUrl);
  }

  obtener(id: number): Observable<responseAPILibro<Libros>> {
    return this.http.get<responseAPILibro<Libros>>(`${this.apiUrl}/${id}`);
  }

 getImageUrl(nombreArchivo: string): string {
  return `https://localhost:7105/Portadas/${nombreArchivo}`;
}

// Método para descargar el archivo PDF
 descargarLibro(nombreArchivo: string) : Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${nombreArchivo}`, {
      responseType: 'blob' // Especifica que la respuesta es un Blob (archivo binario)
    });
  }

  crear(objeto: Libros): Observable<responseAPILibro<Libros>> {
    return this.http.post<responseAPILibro<Libros>>(this.apiUrl, objeto);
  }

  editar(objeto: Libros): Observable<responseAPILibro<Libros>> {
    return this.http.put<responseAPILibro<Libros>>(`${this.apiUrl}/${objeto.idLibro}`, objeto);
  }

  borrar(id: number): Observable<any> {
    return this.http.delete<responseAPILibro<any>>(`${this.apiUrl}/${id}`);
  }
}
