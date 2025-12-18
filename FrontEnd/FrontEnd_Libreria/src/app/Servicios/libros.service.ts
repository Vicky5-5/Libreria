import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libros } from '../interface/Libros';
import { responseAPILibro } from '../Models/responseAPILibro';
import { appsettings } from '../Settings/appsettings/appsettings';
import { EditarLibroAdminDTO } from '../interface/EditarLibroAdminDTO';
import { CrearLibroAdminDTO } from '../interface/CrearLibroAdminDTO';


@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "/libros";

  listar(): Observable<responseAPILibro<Libros[]>> {
    return this.http.get<responseAPILibro<Libros[]>>(this.apiUrl);
  }

  obtener(id: string): Observable<responseAPILibro<Libros>> {
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

  crear(objeto: CrearLibroAdminDTO): Observable<responseAPILibro<CrearLibroAdminDTO>> {
    return this.http.post<responseAPILibro<CrearLibroAdminDTO>>(this.apiUrl, objeto);
  }

  editar(idLibro: string, objeto: EditarLibroAdminDTO): Observable<Libros> {
    return this.http.put<Libros>(`${this.apiUrl}/${idLibro}`, objeto);
  }

  borrar(id: string): Observable<any> {
    return this.http.delete<responseAPILibro<any>>(`${this.apiUrl}/${id}`);
  }
}
