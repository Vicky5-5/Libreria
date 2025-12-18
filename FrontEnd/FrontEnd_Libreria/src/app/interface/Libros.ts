export interface Libros {
  idLibro: string;
  rutaArchivoPortada: string;
  rutaArchivoPDF: string;
  titulo: string;
  autor: string;
  yearPublicacion: number;
  genero: number;
  idioma: string;
  sinopsis: string;
  disponibilidad: boolean;
  archivoPDF?: File;
  portada?: File;
}
export enum Genero {
  Terror = 0,
  Comedia = 1,
  Romance = 2,
  Acción = 3
}
