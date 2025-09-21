export interface Libros {
  idLibro: number;
  rutaArchivoPortada: string;
  rutaArchivoPDF: string;     
  titulo: string;
  autor: string;
  yearPublicacion: number;
  genero: Genero;
  favorito: boolean;
  estado: boolean;
}
export enum Genero {
  Terror = 0,
  Comedia = 1,
  Romance = 2,
  Accion = 3
}

