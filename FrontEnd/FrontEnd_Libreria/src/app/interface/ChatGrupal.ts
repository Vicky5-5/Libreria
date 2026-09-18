
export interface ChatGrupal {
  id: string;
  grupoId: string;
  emisorId: string;
  nombre: string;
  mensaje: string;
  fecha: string;
  editado?: boolean;
  eliminado?: boolean; 
  descripcion?: string; // opcional, para mostrar la descripción del grupo
}
