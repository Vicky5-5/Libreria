import { Usuario } from "./Usuario";

export interface ChatGrupal {
  GrupoId: string;
  Nombre: string;
  Descripcion: string;
  Miembros: Usuario[];
  FechaCreacion: Date;
  FechaIngreso: Date;   

}
